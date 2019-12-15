/* @flow */
'use strict';

import { validateParams } from './paramsValidator';
import { invalidParameter } from '../../../constants/errors';

import type {
    NEM2SignTxMessage,
    NEM2TransactionCommon,
    NEM2EmbeddedTransactionCommon,
    NEM2Transfer,
    NEM2MosaicDefinition,
    NEM2MosaicSupply,
    NEM2NamespaceRegistration,
    NEM2AddressAlias,
    NEM2MosaicAlias,
    NEM2NamespaceMetadata,
    NEM2MosaicMetadata,
    NEM2AccountMetadata,
    NEM2SecretLock,
    NEM2SecretProof,
    NEM2HashLock,
    NEM2Aggregate,
    NEM2InnerTransaction
} from '../../../types/trezor';

import type {
    Transaction as $NEM2Transaction,
    Mosaic as $NEM2Mosaic
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
export const NEM2_MOSAIC_DEFINITION: number = 0x414D;
export const NEM2_MOSAIC_SUPPLY: number = 0x424D;
export const NEM2_NAMESPACE_REGISTRATION: number = 0x414E;
export const NEM2_ADDRESS_ALIAS: number = 0x424E;
export const NEM2_MOSAIC_ALIAS: number = 0x434E;
export const NEM2_NAMESPACE_METADATA: number = 0x4344;
export const NEM2_MOSAIC_METADATA: number = 0x4244;
export const NEM2_ACCOUNT_METADATA: number = 0x4144;
export const NEM2_SECRET_LOCK: number = 0x4152;
export const NEM2_SECRET_PROOF: number = 0x4252;
export const NEM2_HASH_LOCK: number = 0x4148;
export const NEM2_AGGREGATE_COMPLETE: number = 0x4141;
export const NEM2_AGGREGATE_BONDED: number = 0x4241;

export const TX_TYPES = {
    'transfer': NEM2_TRANSFER,
    'mosaicSupply': NEM2_MOSAIC_SUPPLY,
    'namespaceRegistration': NEM2_NAMESPACE_REGISTRATION,
    'addressAlias': NEM2_ADDRESS_ALIAS,
    'mosaicAlias': NEM2_MOSAIC_ALIAS,
    'namespaceMetadata': NEM2_NAMESPACE_METADATA,
    'mosaicMetadata': NEM2_MOSAIC_METADATA,
    'accountMetadata': NEM2_ACCOUNT_METADATA,
    'secretLock': NEM2_SECRET_LOCK,
    'secretProof': NEM2_SECRET_PROOF,
    'hashLock': NEM2_HASH_LOCK,
    'aggregate': NEM2_AGGREGATE_COMPLETE,
    'aggregate': NEM2_AGGREGATE_BONDED,
};

const getCommon = (tx: $NEM2Transaction): NEM2TransactionCommon => {
    validateParams(tx, [
        { name: 'type', type: 'number', obligatory: true },
        { name: 'network', type: 'number', obligatory: true },
        { name: 'version', type: 'number', obligatory: true },
        { name: 'maxFee', type: 'string', obligatory: true },
        { name: 'deadline', type: 'string', obligatory: true },
    ]);
    return {
        type: tx.type,
        network_type: tx.network,
        version: tx.version,
        max_fee: tx.maxFee,
        deadline: tx.deadline,
    };
};

const getEmbeddedCommon = (tx: $NEM2Transaction): NEM2EmbeddedTransactionCommon => {
    validateParams(tx, [
        { name: 'type', type: 'number', obligatory: true },
        { name: 'network', type: 'number', obligatory: true },
        { name: 'version', type: 'number', obligatory: true },
        { name: 'signerPublicKey', type: 'string', obligatory: true },
    ]);
    return {
        type: tx.type,
        network_type: tx.network,
        version: tx.version,
        public_key: tx.signerPublicKey
    };
};

const transferMessage = (tx: $NEM2Transaction): NEM2Transfer => {
    validateParams(tx, [
        { name: 'mosaics', type: 'array', obligatory: true },
        { name: 'message', type: 'object', obligatory: true },
        { name: 'recipientAddress', type: 'object', obligatory: true },
    ]);

    validateParams(tx.message, [
        { name: 'payload', type: 'string', obligatory: true },
        { name: 'type', type: 'number', obligatory: true },
    ]);

    validateParams(tx.recipientAddress, [
        { name: 'address', type: 'string', obligatory: true },
        { name: 'networkType', type: 'number', obligatory: true },
    ]);

    const mosaics: Array<$NEM2Mosaic> = tx.mosaics.map((mosaic: $NEM2Mosaic) => {
        validateParams(mosaic, [
            { name: 'id', type: 'string', obligatory: true },
            { name: 'amount', type: 'string', obligatory: true },
        ]);
        return {
            id: mosaic.id,
            amount: mosaic.amount,
        }
    });

    return {
        recipient_address: {
            address: tx.recipientAddress.address,
            network_type: tx.recipientAddress.networkType,
        },
        message: tx.message,
        mosaics
    };
};

const mosaicDefinitionMessage = (tx: $NEM2Transaction): NEM2MosaicDefinition => {
    validateParams(tx, [
        { name: 'nonce', type: 'number', obligatory: true },
        { name: 'id', type: 'string', obligatory: true },
        { name: 'flags', type: 'number', obligatory: true },
        { name: 'divisibility', type: 'number', obligatory: true },
        { name: 'duration', type: 'string', obligatory: true },
    ]);
    return {
        nonce: tx.nonce,
        mosaic_id: tx.id,
        flags: tx.flags,
        divisibility: tx.divisibility,
        duration: tx.duration,
    };
};

const mosaicSupplyMessage = (tx: $NEM2Transaction): NEM2MosaicSupply => {
    validateParams(tx, [
        { name: 'mosaicId', type: 'string', obligatory: true },
        { name: 'action', type: 'number', obligatory: true },
        { name: 'delta', type: 'string', obligatory: true },
    ]);
    return {
        mosaic_id: tx.mosaicId,
        action: tx.action,
        delta: tx.delta
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

    throw invalidParameter('Invalid Registration Type');
};

const addressAliasMessage = (tx: $NEM2Transaction): NEM2AddressAlias => {
    validateParams(tx, [
        { name: 'namespaceId', type: 'string', obligatory: true },
        { name: 'aliasAction', type: 'number', obligatory: true },
        { name: 'address', type: 'object', obligatory: true },
    ]);

    if (tx.aliasAction !== 0 && tx.aliasAction !== 1) {
        throw invalidParameter('Invalid Alias Action');
    }

    return {
        namespace_id: tx.namespaceId,
        alias_action: tx.aliasAction,
        address: {
            address: tx.address.address,
            network_type: tx.address.networkType,
        },
    };
};

const mosaicAliasMessage = (tx: $NEM2Transaction): NEM2MosaicAlias => {
    validateParams(tx, [
        { name: 'namespaceId', type: 'string', obligatory: true },
        { name: 'mosaicId', type: 'string', obligatory: true },
        { name: 'aliasAction', type: 'number', obligatory: true },
    ]);

    if (tx.aliasAction !== 0 && tx.aliasAction !== 1) {
        throw invalidParameter('Invalid Alias Action');
    }

    return {
        namespace_id: tx.namespaceId,
        mosaic_id: tx.mosaicId,
        alias_action: tx.aliasAction,
    };
};

const namespaceMetadataMessage = (tx: $NEM2Transaction): NEM2NamespaceMetadata => {
    validateParams(tx, [
        { name: 'targetPublicKey', type: 'string', obligatory: true },
        { name: 'scopedMetadataKey', type: 'string', obligatory: true },
        { name: 'targetNamespaceId', type: 'string', obligatory: true },
        { name: 'valueSizeDelta', type: 'number', obligatory: true },
        { name: 'valueSize', type: 'number', obligatory: true },
        { name: 'value', type: 'string', obligatory: true },
    ]);

    if (tx.valueSize > 1024) {
        throw invalidParameter('Invalid value size, value size cannot be greater than 1024');
    }

    return {
        target_public_key: tx.targetPublicKey,
        scoped_metadata_key: tx.scopedMetadataKey,
        target_namespace_id: tx.targetNamespaceId,
        value_size_delta: tx.valueSizeDelta,
        value_size: tx.valueSize,
        value: tx.value,
    };
};

const mosaicMetadataMessage = (tx: $NEM2Transaction): NEM2MosaicMetadata => {
    validateParams(tx, [
        { name: 'targetPublicKey', type: 'string', obligatory: true },
        { name: 'scopedMetadataKey', type: 'string', obligatory: true },
        { name: 'targetMosaicId', type: 'string', obligatory: true },
        { name: 'valueSizeDelta', type: 'number', obligatory: true },
        { name: 'valueSize', type: 'number', obligatory: true },
        { name: 'value', type: 'string', obligatory: true },
    ]);

    if (tx.valueSize > 1024) {
        throw invalidParameter('Invalid value size, value size cannot be greater than 1024');
    }

    return {
        target_public_key: tx.targetPublicKey,
        scoped_metadata_key: tx.scopedMetadataKey,
        target_mosaic_id: tx.targetMosaicId,
        value_size_delta: tx.valueSizeDelta,
        value_size: tx.valueSize,
        value: tx.value,
    };
};

const accountMetadataMessage = (tx: $NEM2Transaction): NEM2AccountMetadata => {
    validateParams(tx, [
        { name: 'targetPublicKey', type: 'string', obligatory: true },
        { name: 'scopedMetadataKey', type: 'string', obligatory: true },
        { name: 'valueSizeDelta', type: 'number', obligatory: true },
        { name: 'valueSize', type: 'number', obligatory: true },
        { name: 'value', type: 'string', obligatory: true },
    ]);

    if (tx.valueSize > 1024) {
        throw invalidParameter('Invalid value size, value size cannot be greater than 1024');
    }

    return {
        target_public_key: tx.targetPublicKey,
        scoped_metadata_key: tx.scopedMetadataKey,
        value_size_delta: tx.valueSizeDelta,
        value_size: tx.valueSize,
        value: tx.value,
    };
};

const secretLockMessage = (tx: $NEM2Transaction): NEM2SecretLock => {
    validateParams(tx, [
        { name: 'mosaicId', type: 'string', obligatory: true },
        { name: 'amount', type: 'string', obligatory: true },
        { name: 'duration', type: 'string', obligatory: true },
        { name: 'hashAlgorithm', type: 'number', obligatory: true },
        { name: 'secret', type: 'string', obligatory: true },
        { name: 'recipientAddress', type: 'object', obligatory: true },
    ]);

    validateParams(tx.recipientAddress, [
        { name: 'address', type: 'string', obligatory: true },
        { name: 'networkType', type: 'number', obligatory: true },
    ]);

    if (tx.hashAlgorithm !== 0 &&
        tx.hashAlgorithm !== 1 &&
        tx.hashAlgorithm !== 2 &&
        tx.hashAlgorithm !== 3) {
        throw invalidParameter('Invalid Hash Algorithm');
    }

    return {
        mosaic: {
            id: tx.mosaicId,
            amount: tx.amount
        },
        duration: tx.duration,
        hash_algorithm: tx.hashAlgorithm,
        secret: tx.secret,
        recipient_address: {
            address: tx.recipientAddress.address,
            network_type: tx.recipientAddress.networkType
        },
    };
};

const secretProofMessage = (tx: $NEM2Transaction): NEM2SecretProof => {
    validateParams(tx, [
        { name: 'hashAlgorithm', type: 'number', obligatory: true },
        { name: 'secret', type: 'string', obligatory: true },
        { name: 'proof', type: 'string', obligatory: true },
    ]);

    validateParams(tx.recipientAddress, [
        { name: 'address', type: 'string', obligatory: true },
        { name: 'networkType', type: 'number', obligatory: true },
    ]);

    if (tx.hashAlgorithm !== 0 &&
        tx.hashAlgorithm !== 1 &&
        tx.hashAlgorithm !== 2 &&
        tx.hashAlgorithm !== 3) {
        throw invalidParameter('Invalid Hash Algorithm');
    }

    return {
        hash_algorithm: tx.hashAlgorithm,
        secret: tx.secret,
        proof: tx.proof,
        recipient_address: {
            address: tx.recipientAddress.address,
            network_type: tx.recipientAddress.networkType
        },
    };
};

const hashLockMessage = (tx: $NEM2Transaction): NEM2HashLock => {
    validateParams(tx, [
        { name: 'mosaicId', type: 'string', obligatory: true },
        { name: 'amount', type: 'string', obligatory: true },
        { name: 'duration', type: 'string', obligatory: true },
        { name: 'hash', type: 'string', obligatory: true },
    ]);

    return {
        mosaic: {
            id: tx.mosaicId,
            amount: tx.amount
        },
        duration: tx.duration,
        hash: tx.hash
    };
};

const hashAggregate = (tx: $NEM2Transaction): NEM2Aggregate => {
    validateParams(tx, [
        { name: 'innerTransactions', type: 'array', obligatory: true },
        { name: 'cosignatures', type: 'array', obligatory: false },
    ]);
    const inner_transactions = tx.innerTransactions.map((transaction) => {
        const inner_transaction: NEM2InnerTransaction = {
            common: getEmbeddedCommon(transaction),
            ...getTransactionBody(transaction)
        };

        return inner_transaction;
    })

    let cosignatures = [];
    if ('cosignatures' in tx) {
        cosignatures = tx.cosignatures.map(cosignature => ({
            signature: cosignature.signature,
            public_key: cosignature.publicKey
        }))
    }

    return {
        inner_transactions,
        cosignatures
    };
};

const getTransactionBody = (transaction) => {
    const message = {}
    switch (transaction.type) {
        case NEM2_TRANSFER:
            message.transfer = transferMessage(transaction);
            break;
        case NEM2_MOSAIC_DEFINITION:
            message.mosaic_definition = mosaicDefinitionMessage(transaction);
            break;
        case NEM2_MOSAIC_SUPPLY:
            message.mosaic_supply = mosaicSupplyMessage(transaction);
            break;
        case NEM2_NAMESPACE_REGISTRATION:
            message.namespace_registration = namespaceRegistrationMessage(transaction);
            break;
        case NEM2_ADDRESS_ALIAS:
            message.address_alias = addressAliasMessage(transaction);
            break;
        case NEM2_MOSAIC_ALIAS:
            message.mosaic_alias = mosaicAliasMessage(transaction);
            break;
        case NEM2_NAMESPACE_METADATA:
            message.namespace_metadata = namespaceMetadataMessage(transaction);
            break;
        case NEM2_MOSAIC_METADATA:
            message.mosaic_metadata = mosaicMetadataMessage(transaction);
            break;
        case NEM2_ACCOUNT_METADATA:
            message.account_metadata = accountMetadataMessage(transaction);
            break;
        case NEM2_SECRET_LOCK:
            message.secret_lock = secretLockMessage(transaction);
            break;
        case NEM2_SECRET_PROOF:
            message.secret_proof = secretProofMessage(transaction);
            break;
        case NEM2_HASH_LOCK:
            message.hash_lock = hashLockMessage(transaction);
            break;
        case NEM2_AGGREGATE_COMPLETE:
            message.aggregate = hashAggregate(transaction);
            break;
        case NEM2_AGGREGATE_BONDED:
            message.aggregate = hashAggregate(transaction);
            break;

        default:
            throw new Error(`Unknown transaction type: ${transaction.type}`);
    }

    return message;

}

export const createTx = (tx: $NEM2Transaction, address_n: Array<number>, generation_hash: string): NEM2SignTxMessage => {
    const transaction: $NEM2Transaction = tx;
    const message: NEM2SignTxMessage = {
        address_n: address_n,
        generation_hash: generation_hash,
        transaction: getCommon(tx),
        ...getTransactionBody(transaction)
    };

    return message;
};
