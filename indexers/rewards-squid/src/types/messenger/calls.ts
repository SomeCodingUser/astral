import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v0 from '../v0'
import * as v3 from '../v3'

export const initiateChannel =  {
    name: 'Messenger.initiate_channel',
    /**
     * See [`Pallet::initiate_channel`].
     */
    v0: new CallType(
        'Messenger.initiate_channel',
        sts.struct({
            dstChainId: v0.ChainId,
            params: v0.InitiateChannelParams,
        })
    ),
}

export const closeChannel =  {
    name: 'Messenger.close_channel',
    /**
     * See [`Pallet::close_channel`].
     */
    v0: new CallType(
        'Messenger.close_channel',
        sts.struct({
            chainId: v0.ChainId,
            channelId: sts.bigint(),
        })
    ),
}

export const relayMessage =  {
    name: 'Messenger.relay_message',
    /**
     * See [`Pallet::relay_message`].
     */
    v0: new CallType(
        'Messenger.relay_message',
        sts.struct({
            msg: v0.CrossDomainMessage,
        })
    ),
    /**
     * See [`Pallet::relay_message`].
     */
    v3: new CallType(
        'Messenger.relay_message',
        sts.struct({
            msg: v3.CrossDomainMessage,
        })
    ),
}

export const relayMessageResponse =  {
    name: 'Messenger.relay_message_response',
    /**
     * See [`Pallet::relay_message_response`].
     */
    v0: new CallType(
        'Messenger.relay_message_response',
        sts.struct({
            msg: v0.CrossDomainMessage,
        })
    ),
    /**
     * See [`Pallet::relay_message_response`].
     */
    v3: new CallType(
        'Messenger.relay_message_response',
        sts.struct({
            msg: v3.CrossDomainMessage,
        })
    ),
}

export const updateConsensusChainAllowlist =  {
    name: 'Messenger.update_consensus_chain_allowlist',
    /**
     * See [`Pallet::update_consensus_chain_allowlist`].
     */
    v3: new CallType(
        'Messenger.update_consensus_chain_allowlist',
        sts.struct({
            update: v3.ChainAllowlistUpdate,
        })
    ),
}

export const initiateDomainUpdateChainAllowlist =  {
    name: 'Messenger.initiate_domain_update_chain_allowlist',
    /**
     * See [`Pallet::initiate_domain_update_chain_allowlist`].
     */
    v3: new CallType(
        'Messenger.initiate_domain_update_chain_allowlist',
        sts.struct({
            domainId: v3.DomainId,
            update: v3.ChainAllowlistUpdate,
        })
    ),
}

export const updateDomainAllowlist =  {
    name: 'Messenger.update_domain_allowlist',
    /**
     * See [`Pallet::update_domain_allowlist`].
     */
    v3: new CallType(
        'Messenger.update_domain_allowlist',
        sts.struct({
            updates: v3.DomainAllowlistUpdates,
        })
    ),
}
