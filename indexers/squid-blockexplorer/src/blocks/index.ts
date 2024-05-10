import { ApiPromise } from "@polkadot/api";
import { Context } from "../processor";
import { ProcessBlocksDependencies } from "./types";
import {
  getHistorySizeFactory,
  getSpacePledgedFactory,
  digestStorageFactory,
  getBlockAuthorFactory,
  solutionRangesStorageFactory,
} from "./storage";
import { processCalls, processExtrinsicsFactory } from "./processCalls";
import { processEventsFactory } from "./processEvents";
import { getLogsFactory } from "./getLogs";
export { processBlocksFactory } from "./processBlocks";
import {
  getOrCreateAccountFactory,
  addExtrinsicModuleNameFactory,
  addEventModuleNameFactory,
  getOrCreateOperatorFactory,
  getOrCreateNominatorsFactory,
  getOrCreateAccountRewardsFactory,
  getOrCreateOperatorRewardsFactory,
} from "./utils";

export function createProcessBlocksDependencies(
  ctx: Context,
  api: ApiPromise
): ProcessBlocksDependencies {
  const getBlockAuthor = getBlockAuthorFactory(ctx, api);
  const getSpacePledged = getSpacePledgedFactory(
    ctx,
    solutionRangesStorageFactory
  );
  const getHistorySize = getHistorySizeFactory(ctx);
  const getOrCreateAccount = getOrCreateAccountFactory(ctx);
  const getOrCreateAccountRewards = getOrCreateAccountRewardsFactory(ctx);
  const getOrCreateOperator = getOrCreateOperatorFactory(ctx, api);
  const getOrCreateOperatorRewards = getOrCreateOperatorRewardsFactory(ctx);
  const getOrCreateNominators = getOrCreateNominatorsFactory(
    ctx,
    api,
    getOrCreateAccount
  );
  const addEventModuleName = addEventModuleNameFactory(ctx);
  const addExtrinsicModuleName = addExtrinsicModuleNameFactory(ctx);
  const processExtrinsics = processExtrinsicsFactory(
    getOrCreateAccount,
    addExtrinsicModuleName
  );
  const processEvents = processEventsFactory(
    ctx,
    getOrCreateAccount,
    addEventModuleName,
    getOrCreateOperator,
    getOrCreateNominators,
    getOrCreateAccountRewards,
    getOrCreateOperatorRewards,
  );
  const getLogs = getLogsFactory(ctx, digestStorageFactory);

  return {
    getSpacePledged,
    getHistorySize,
    processExtrinsics,
    processCalls,
    processEvents,
    getLogs,
    getBlockAuthor,
  };
}
