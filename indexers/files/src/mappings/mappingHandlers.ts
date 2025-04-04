global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
global.Buffer = require("buffer/").Buffer;

import {
  cidOfNode,
  cidToString,
  decodeNode,
  IPLDNodeData,
  MetadataType,
  PBNode,
} from "@autonomys/auto-dag-data";
import { stringify } from "@autonomys/auto-utils";
import { Bytes } from "@polkadot/types";
import { compactStripLength } from "@polkadot/util";
import { SubstrateExtrinsic } from "@subql/types";
import {
  createAndSaveChunk,
  createAndSaveCid,
  createAndSaveError,
  createAndSaveFile,
  createAndSaveFolder,
  createAndSaveMetadata,
} from "./db";
import { ExtrinsicPrimitive } from "./types";

const hexToUint8Array = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0)
    throw new Error("Hex string must have an even length");
  return new Uint8Array(
    hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );
};

export async function handleCall(_call: SubstrateExtrinsic): Promise<void> {
  const {
    idx,
    block: {
      timestamp,
      block: {
        header: { number, hash: blockHash },
      },
    },
    extrinsic: { method, hash },
    success,
  } = _call;
  // Skip if extrinsic failed
  if (!success) return;

  const methodToPrimitive = method.toPrimitive() as ExtrinsicPrimitive;
  try {
    const data = methodToPrimitive.args.remark;
    const hexString = data.startsWith("0x") ? data.slice(2) : data;
    const buffer = Buffer.from(hexString, "hex");
    const [length, bytes] = compactStripLength(buffer);
    const isValidLength = length === bytes.length;
    let node: PBNode | null = null;

    try {
      const encoded = isValidLength
        ? Bytes.from(buffer)
        : hexToUint8Array(data);
      node = decodeNode(encoded);
    } catch (error) {
      node = decodeNode(buffer);
    }
    const cid = cidToString(cidOfNode(node));
    const links = node.Links.map((l) => cidToString(l.Hash));
    if (cid) {
      await createAndSaveCid(
        cid,
        BigInt(number.toString()),
        blockHash.toString(),
        `${number}-${idx}`,
        hash.toString(),
        idx,
        links,
        timestamp ? timestamp : new Date(0)
      );

      if (node.Data) {
        const nodeData = IPLDNodeData.decode(node.Data);
        let stringifyData = "";
        try {
          const data = JSON.parse(stringify(nodeData.data)).data;
          if (!data) throw new Error("Data is null");

          const dataAsArrayBuffer = new Uint8Array(data);
          stringifyData = stringify(dataAsArrayBuffer);
        } catch {
          stringifyData = stringify(nodeData.data);
        }
        await createAndSaveChunk(
          cid,
          nodeData.type,
          nodeData.linkDepth,
          nodeData.size,
          nodeData.name,
          stringifyData,
          stringify(nodeData.uploadOptions)
        );

        switch (nodeData.type) {
          case MetadataType.Metadata:
            await createAndSaveMetadata(cid, links, nodeData.name);
            break;
          case MetadataType.Folder:
            await createAndSaveFolder(cid, links, nodeData.name);
            break;
          case MetadataType.File:
            await createAndSaveFile(cid, links, nodeData.name);
            break;
          // Skip inlinks and chunks as they are already saved in chunks table
          case MetadataType.FileInlink:
          case MetadataType.FileChunk:
          case MetadataType.FolderInlink:
          case MetadataType.MetadataInlink:
          case MetadataType.MetadataChunk:
            break;
          default:
            logger.warn(`Unknown node type: ${nodeData.type} for cid: ${cid}`);
            break;
        }
      }
    }
  } catch (error: any) {
    logger.error("Error decoding remark or seedHistory extrinsic");
    logger.error(error);
    await createAndSaveError(
      BigInt(number.toString()),
      blockHash.toString(),
      `${number}-${idx}`,
      hash.toString(),
      idx,
      stringify(error),
      timestamp ? timestamp : new Date(0)
    );
  }
}
