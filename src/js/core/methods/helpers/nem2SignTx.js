/* @flow */
'use strict';

import { validateParams } from './paramsValidator';
import { invalidParameter } from '../../../constants/errors';

import type {
    NEM2TransactionCommon,
    NEM2Transfer,
    NEM2MosaicDefinition,
} from '../../../types/trezor';

import type {
    Transaction as $NEM2Transaction,
    Mosaic as $NEM2Mosaic,
} from '../../../types/nem2';

export const NEM2_MAINNET: number = 0x68;
export const NEM2_TESTNET: number = 0x98;
export const NEM2_MIJIN: number = 0x60;

export const NETWORKS = {
    'mainnet': NEM2_MAINNET,
    'testnet': NEM2_TESTNET,
    'mijin': NEM2_MIJIN,
};

export const NEM2_TRANSFER: number = 0x4154;
export const NEM2_NAMESPACE_REGISTRATION: number = 0x414E;

export const TX_TYPES = {
    'transfer': NEM2_TRANSFER,
    'namespaceRegistration': NEM2_NAMESPACE_REGISTRATION,
};

const getCommon = (tx: $NEM2Transaction): NEMTransactionCommon => {
    // TODO: validate params
    return {
        type: tx.type,
        network_type: tx.network,
        version: tx.version,
        max_fee: tx.maxFee,
        deadline: tx.deadline,
    };
};

const transferMessage = (tx: $NEM2Transaction): NEMTransfer => {
    const mosaics: ?Array<NEM2Mosaic> = tx.mosaics ? tx.mosaics.map((mosaic: $NEM2Mosaic) => ({
        id: mosaic.id,
        amount: mosaic.amount,
    })) : undefined;

    // TODO: validate params
    return {
        recipient_address: tx.recipientAddress ? {
            address: tx.recipientAddress.address,
            network_type: tx.recipientAddress.networkType,
        } : undefined,
        message: tx.message || undefined,
        mosaics,
    };
};

const mosaicDefinitionMessage = (tx: $NEM2Transaction): NEM2MosaicDefinition => {
    // TODO: validate params
    return {
        nonce: tx.nonce,
        mosaic_id: tx.mosaicId,
        flags: tx.flags,
        divisibility: tx.divisibility,
        duration: tx.duration,
    };
};

const namespaceRegistrationMessage = (tx: $NEM2Transaction): NEM2NamespaceRegistration => {
    validateParams(tx, [
        { name: 'namespaceName', type: 'string', obligatory: true },
        { name: 'registrationType', type: 'number', obligatory: true },
        { name: 'id', type: 'string', obligatory: true },
    ]);

    // fields common to both namespace registration types
    const fields = {
        registration_type: tx.registrationType,
        namespace_name: tx.namespaceName,
        id: tx.id,
    };

    // root namespace registration
    if (tx.registrationType === 0) {
        validateParams(tx, [{ name: 'duration', type: 'string', obligatory: true }]);
        return {
            ...fields,
            duration: tx.duration,
        };
    }

    // subnamespace
    if (tx.registrationType === 1) {
        validateParams(tx, [{ name: 'parentId', type: 'string', obligatory: true }]);
        return {
            ...fields,
            parent_id: tx.parentId,
        };
    }

    invalidParameter('Invalid Registration Type');

    return fields;
};

export const createTx = (tx: $NEM2Transaction, address_n: Array<number>, generation_hash: string): NEMSignTxMessage => {
    const transaction: $NEM2Transaction = tx;
    const message: NEMSignTxMessage = {
        address_n: address_n,
        generation_hash: generation_hash,
        transaction: getCommon(tx),
    };

    switch (transaction.type) {
        case NEM2_TRANSFER:
            message.transfer = transferMessage(transaction);
            break;
        case 0x414D:
            message.mosaic_definition = mosaicDefinitionMessage(transaction);
            break;
        case NEM2_NAMESPACE_REGISTRATION:
            message.namespace_registration = namespaceRegistrationMessage(transaction);
            break;
            // case 0x0801:
            //     message.importance_transfer = importanceTransferMessage(transaction);
            //     break;

            // case 0x1001:
            //     message.aggregate_modification = aggregateModificationMessage(transaction);
            //     break;

            // case 0x2001:
            //     message.provision_namespace = provisionNamespaceMessage(transaction);
            //     break;

            // case 0x4001:
            //     message.mosaic_creation = mosaicCreationMessage(transaction);
            //     break;

            // case 0x4002:
            //     message.supply_change = supplyChangeMessage(transaction);
            //     break;

        default:
            throw new Error(`Unknown transaction type: ${transaction.type}`);
    }

    return message;
};
