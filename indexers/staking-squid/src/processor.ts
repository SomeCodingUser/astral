import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Call as _Call,
  Event as _Event,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { assertNotNull } from "@subsquid/util-internal";

import { events } from "./types";

export const processor = new SubstrateBatchProcessor()
  // .setGateway('')
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(
      process.env.RPC_CONSENSUS_HTTP,
      "No RPC endpoint supplied"
    ),
    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    rateLimit: 10,
  })
  .addEvent({
    name: [
      events.domains.storageFeeDeposited.name,
      events.domains.operatorRegistered.name,
      events.domains.operatorDeregistered.name,
      events.domains.operatorNominated.name,
      events.domains.operatorRewarded.name,
      events.domains.operatorSlashed.name,
      events.domains.domainEpochCompleted.name,
      events.domains.withdrewStake.name,
      // new events
      events.domains.forceDomainEpochTransition.name,
      events.domains.operatorTaxCollected.name,
      events.domains.operatorUnlocked.name,
      events.domains.fundsUnlocked.name,
    ],
    extrinsic: true,
  })
  .setFields({
    event: {
      args: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
    },
    block: {
      timestamp: true,
    },
  });
// Uncomment to disable RPC ingestion and drastically reduce no of RPC calls
//.useArchiveOnly()

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
