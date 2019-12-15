/* @flow */

// This file has all various types that go into Trezor or out of it.

export type CipheredKeyValue = {
    value: string,
}

export type Success = {};

export type Features = {
    vendor: string,
    major_version: number,
    minor_version: number,
    patch_version: number,
    bootloader_mode: boolean,
    device_id: string,
    pin_protection: boolean,
    passphrase_protection: boolean,
    language: string,
    label: string,
    initialized: boolean,
    revision: string,
    bootloader_hash: string,
    imported: boolean,
    pin_cached: boolean,
    passphrase_cached: boolean,
    firmware_present: boolean,
    needs_backup: boolean,
    flags: number,
    model: string,
    fw_major: number,
    fw_minor: number,
    fw_patch: number,
    fw_vendor: string,
    fw_vendor_keys: string,
    unfinished_backup: boolean,
    no_backup: boolean,
};

export type ResetDeviceSettings = {
    display_random?: boolean,
    strength?: number,
    passphrase_protection?: boolean,
    pin_protection?: boolean,
    language?: string,
    label?: string,
    u2f_counter?: number,
    skip_backup?: boolean,
};

export type HDPrivNode = {
    depth: number,
    fingerprint: number,
    child_num: number,
    chain_code: string,
    private_key: string,
};

export type HDPubNode = {
    depth: number,
    fingerprint: number,
    child_num: number,
    chain_code: string,
    public_key: string,
};

export type HDNode = HDPubNode | HDPrivNode;

export type LoadDeviceSettings = {
    pin?: string,
    passphrase_protection?: boolean,
    language?: string,
    label?: string,
    skip_checksum?: boolean,
    mnemonics?: Array<string>,
    mnemonic?: string,
    node?: HDNode,
    payload?: string, // will be converted

    u2f_counter?: number,
};

export type RecoverDeviceSettings = {
    word_count?: number,
    passphrase_protection?: boolean,
    pin_protection?: boolean,
    language?: string,
    label?: string,
    enforce_wordlist?: boolean,
    type?: number,
    u2f_counter?: number,
};

export type ApplySettings = {
    language?: string,
    label?: string,
    use_passphrase?: boolean,
    homescreen?: string,
};

export type MessageSignature = {
    address: string,
    signature: string,
}

export type MultisigRedeemScriptType = {
    pubkeys: Array<{ node: string | HDPubNode, address_n: Array<number> }>,
    signatures: Array<string>,
    m?: number,
}

export type InputScriptType = 'SPENDADDRESS' | 'SPENDMULTISIG' | 'SPENDWITNESS' | 'SPENDP2SHWITNESS';
// transaction input, parameter of SignTx message, declared by user
export type TransactionInput = {|
    address_n: Array<number>,
    prev_hash: string,
    prev_index: number,
    script_type: InputScriptType,
    sequence?: number,
    amount?: string, // (segwit, bip143: true, zcash overwinter)
    multisig?: MultisigRedeemScriptType,
|};

// transaction input, parameter of TxAck message, declared by user or downloaded from backend
export type RefTransactionInput = {|
    prev_hash: string,
    prev_index: number,
    script_sig: string,
    sequence: number,
|};

export type OutputScriptType = 'PAYTOADDRESS' | 'PAYTOMULTISIG' | 'PAYTOWITNESS' | 'PAYTOP2SHWITNESS';
// transaction output, parameter of SignTx message, declared by user
export type TransactionOutput = {|
    address: string,
    script_type: 'PAYTOADDRESS',
    amount: string,
    multisig?: MultisigRedeemScriptType,
|} | {|
    address_n: Array<number>,
    script_type: OutputScriptType,
    amount: string,
    multisig?: MultisigRedeemScriptType,
|} | {|
    amount: '0',
    op_return_data: string,
    script_type: 'PAYTOOPRETURN',
|};

type TransactionBinOutput = {
    amount: string,
    script_pubkey: string,
};

export type RefTransaction = {
    hash: string,
    version?: ?number,
    inputs: Array<RefTransactionInput>,
    bin_outputs: Array<TransactionBinOutput>,
    lock_time?: ?number,
    extra_data?: ?string,
    timestamp?: ?number,
    version_group_id?: ?number,
};

export type TransactionOptions = {
    lock_time?: ?number,
    timestamp?: ?number,
    version?: ?number,
    expiry?: ?number,
    overwintered?: ?boolean,
    version_group_id?: ?number,
    branch_id?: ?number,
};

export type TxRequestDetails = {
    request_index: number,
    tx_hash?: string,
    extra_data_len?: number,
    extra_data_offset?: number,
};

export type TxRequestSerialized = {
    signature_index?: number,
    signature?: string,
    serialized_tx?: string,
};

export type TxRequest = {
    request_type: 'TXINPUT' | 'TXOUTPUT' | 'TXMETA' | 'TXFINISHED' | 'TXEXTRADATA',
    details: TxRequestDetails,
    serialized: TxRequestSerialized,
};

export type SignedTx = {
    signatures: Array<string>,
    serializedTx: string,
    txid?: string,
};

export type EthereumTxRequest = {
    data_length?: number,
    signature_v?: number,
    signature_r?: string,
    signature_s?: string,
};

export type EthereumAddress = {
    address: string,
};

export type EthereumSignedTx = {
    // v: number,
    v: string,
    r: string,
    s: string,
};

export type Identity = {
    proto?: string,
    user?: string,
    host?: string,
    port?: string,
    path?: string,
    index?: number,
};

export type SignedIdentity = {
    address: string,
    public_key: string,
    signature: string,
};

export type PublicKey = {
    node: HDPubNode,
    xpub: string,
};

// combined PublicKey and bitcoin.HDNode
export type HDNodeResponse = {
    path: Array<number>,
    serializedPath: string,
    childNum: number,
    xpub: string,
    xpubSegwit?: string,
    chainCode: string,
    publicKey: string,
    fingerprint: number,
    depth: number,
};

// this is what Trezor asks for
export type SignTxInfoToTrezor = {
    inputs: Array<TransactionInput | RefTransactionInput>,
} | {
    bin_outputs: Array<TransactionBinOutput>,
} | {
    outputs: Array<TransactionOutput>,
} | {
    extra_data: string,
} | {
    version: ?number,
    lock_time: ?number,
    inputs_cnt: number,
    outputs_cnt: number,
    extra_data_len?: number,
    timestamp: ?number,
    version_group_id: ?number,
};

// NEM types
export type NEMAddress = {
    address: string,
}

export type NEMSignedTx = {
    data: string,
    signature: string,
}

export type NEMTransactionCommon = {
    address_n: ?Array<number>,
    network: ?number,
    timestamp: ?number,
    fee: ?number,
    deadline: ?number,
    signer: ?string,
}

export type NEMMosaic = {
    namespace: ?string,
    mosaic: ?string,
    quantity: ?number,
}

export type NEMTransfer = {
    mosaics: ?Array<NEMMosaic>,
    public_key: ?string,
    recipient: ?string,
    amount: ?number,
    payload: ?string,
}

export type NEMProvisionNamespace = {
    namespace: ?string,
    sink: ?string,
    fee: ?number,
    parent: ?string,
}

export type NEMMosaicLevyType = {
    id: 1,
    name: 'MosaicLevy_Absolute',
} | {
    id: 2,
    name: 'MosaicLevy_Percentile',
}

export type NEMSupplyChangeType = {
    id: 1,
    name: 'SupplyChange_Increase',
} | {
    id: 2,
    name: 'SupplyChange_Decrease',
}

export type NEMModificationType = {
    id: 1,
    name: 'CosignatoryModification_Add',
} | {
    id: 2,
    name: 'CosignatoryModification_Delete',
}

export type NEMImportanceTransferMode = {
    id: 1,
    name: 'ImportanceTransfer_Activate',
} | {
    id: 2,
    name: 'ImportanceTransfer_Deactivate',
}

export type NEMMosaicDefinition = {
    name?: string,
    ticker?: string,
    namespace?: string,
    mosaic?: string,
    divisibility?: number,
    fee?: number,
    levy?: NEMMosaicLevyType,
    levy_address?: string,
    levy_namespace?: string,
    levy_mosaic?: string,
    supply?: number,
    mutable_supply?: boolean,
    transferable?: boolean,
    description?: string,
    networks?: number,
}

export type NEMMosaicCreation = {
    definition: ?NEMMosaicDefinition,
    sink: ?string,
    fee: ?number,
}

export type NEMMosaicSupplyChange = {
    namespace?: string,
    type?: NEMSupplyChangeType,
    mosaic?: string,
    delta?: number,
}

export type NEMCosignatoryModification = {
    type?: NEMModificationType,
    public_key?: string,
}

export type NEMAggregateModification = {
    modifications: ?Array<NEMCosignatoryModification>,
    relative_change: ?number, // TODO: "sint32"
}

export type NEMImportanceTransfer = {
    mode?: NEMImportanceTransferMode,
    public_key?: string,
}

export type NEMSignTxMessage = {
    transaction?: NEMTransactionCommon,
    cosigning?: boolean,
    multisig?: NEMTransactionCommon,
    transfer?: NEMTransfer,
    provision_namespace?: NEMProvisionNamespace,
    mosaic_creation?: NEMMosaicCreation,
    supply_change?: NEMMosaicSupplyChange,
    aggregate_modification?: NEMAggregateModification,
    importance_transfer?: NEMImportanceTransfer,
}

// NEM2 types

// TODO: public key

export type NEM2SignTxMessage = {
    address_n: Array<number>,
    generation_hash: string,
    transaction: NEM2TransactionCommon,
    transfer?: NEM2Transfer,
    mosaic_definition?: NEM2MosaicDefinition,
    mosaic_supply?: NEM2MosaicSupply,
    namespace_registration?: NEM2NamespaceRegistration,
    address_alias?: NEM2AddressAlias,
    mosaic_alias?: NEM2MosaicAlias,
    namespace_metadata?: NEM2NamespaceMetadata,
    mosaic_metadata?: NEM2MosaicMetadata,
    account_metadata?: NEM2AccountMetadata,
    secret_lock?: NEM2SecretLock,
    secret_proof?: NEM2SecretProof,
    hash_lock?: NEM2HashLock,
    aggregate?: NEM2Aggregate
}

export type NEM2SignedTx = {
    payload: string,
    hash: string,
    signature: string
}

export type NEM2TransactionCommon = {
    type: number,
    network_type: number,
    version: number,
    max_fee: string, // uint64
    deadline: string, // uint64
    signer?: ?string,
    signature?: ?string,
}

export type NEM2EmbeddedTransactionCommon = {
    type: number,
    network_type: number,
    version: number,
    public_key: string,
    signature?: ?string,
}

export type NEM2Mosaic = {
    id: string,
    amount: string
}

export type NetworkType =
    104 // MAIN_NET
  | 152 // TEST_NET
  | 96 // MIJIN
  | 144 // MIJIN_TEST

export type NEM2Address = {
    address: String,
    network_type: NetworkType,
}

type NEM2Message = {
    payload: string,
    type: number,
}

export type NEM2Transfer = {
    recipient_address: NEM2Address,
    mosaics: Array<NEM2Mosaic>,
    message: NEM2Message,
}

export type NEM2MosaicDefinition = {
    nonce: number,
    mosaic_id: string,
    flags: number,
    divisibility: number,
    duration: string,
}

export type NEM2MosaicSupply = {
    mosaic_id: string,
    action: number,
    delta: string
}

export type NEM2NamespaceRegistration = {
    id: string,
    parent_id?: string,
    duration?: ?string,
    namespace_name: string,
    registration_type: number,
}

export type NEM2AddressAlias = {
    namespace_id: string,
    alias_action: number,
    address: NEM2Address,
}

export type NEM2MosaicAlias = {
    namespace_id: string,
    mosaic_id: string,
    alias_action: number
}

export type NEM2NamespaceMetadata = {
    target_public_key: string,
    scoped_metadata_key: string,
    target_namespace_id: string,
    value_size_delta: number,
    value_size: number,
    value: string,
}

export type NEM2MosaicMetadata = {
    target_public_key: string,
    scoped_metadata_key: string,
    target_mosaic_id: string,
    value_size_delta: number,
    value_size: number,
    value: string,
}

export type NEM2AccountMetadata = {
    target_public_key: string,
    scoped_metadata_key: string,
    value_size_delta: number,
    value_size: number,
    value: string,
}

export type NEM2SecretLock = {
    mosaic: NEM2Mosaic,
    duration: string,
    hash_algorithm: number,
    secret: string,
    recipient_address: NEM2Address
}

export type NEM2SecretProof = {
    hash_algorithm: number,
    secret: string,
    proof: string,
    recipient_address: NEM2Address
}

export type NEM2HashLock = {
    mosaic: NEM2Mosaic,
    duration: string,
    hash: string
}

export type NEM2Aggregate = {
    inner_transactions: Array<NEM2InnerTransaction>,
    cosignatures?: Array<NEM2Cosignatures>
}

export type NEM2InnerTransaction = {
    common: NEM2EmbeddedTransactionCommon,
    transfer?: NEM2Transfer,
    mosaic_definition?: NEM2MosaicDefinition,
    mosaic_supply?: NEM2MosaicSupply,
    namespace_registration?: NEM2NamespaceRegistration,
    address_alias?: NEM2AddressAlias,
    mosaic_alias?: NEM2MosaicAlias,
    namespace_metadata?: NEM2NamespaceMetadata,
    mosaic_metadata?: NEM2MosaicMetadata,
    account_metadata?: NEM2AccountMetadata,
    secret_lock?: NEM2SecretLock,
    secret_proof?: NEM2SecretProof,
    hash_lock?: NEM2HashLock
}

export type NEM2Cosignatures = {
    signature: string,
    public_key: string
}
// export type NEM2SignedTx = {
//     payload: ?string,
//     hash: ?string,
//     signature: ?string,
// }

// Stellar types

export type StellarAddress = {
    address: string,
}

export type StellarSignedTx = {
    public_key: string,
    signature: string,
}

export type StellarPaymentOp = {
    type: "StellarTxOpRequest",
    message: {},
}

export type StellarSignTxMessage = {|
    address_n: Array<number>,
    source_account: string,
    fee: number,
    sequence_number: string,
    network_passphrase: string,
    timebounds_start?: number,
    timebounds_end?: number,
    memo_type?: number,
    memo_text?: string | typeof undefined,
    memo_id?: string | typeof undefined,
    memo_hash?: string | Buffer | typeof undefined,
    num_operations: number,
|}

export type StellarAsset = {
    type: 0 | 1 | 2,
    code: string,
    issuer?: string,
}

export type StellarOperationMessage = {
    type: 'StellarCreateAccountOp',
    source_account?: string,
    new_account: string,
    starting_balance: string,
} | {
    type: 'StellarPaymentOp',
    source_account?: string,
    destination_account: string,
    asset: StellarAsset | typeof undefined,
    amount: string,
} | {
    type: 'StellarPathPaymentOp',
    source_account?: string,
    send_asset: StellarAsset,
    send_max: string,
    destination_account: string,
    destination_asset: StellarAsset,
    destination_amount: string,
    paths?: Array<StellarAsset> | typeof undefined,
} | {
    type: 'StellarManageOfferOp',
    source_account?: string,
    offer_id?: string,
    amount: string,
    buying_asset: StellarAsset,
    selling_asset: StellarAsset,
    price_n: number,
    price_d: number,
} | {
    type: 'StellarCreatePassiveOfferOp',
    source_account?: string,
    offer_id?: string,
    amount: string,
    buying_asset: StellarAsset,
    selling_asset: StellarAsset,
    price_n: number,
    price_d: number,
} | {
    type: 'StellarSetOptionsOp',
    source_account?: string,
    signer_type?: number | typeof undefined,
    signer_key?: string | Buffer | typeof undefined,
    signer_weight?: number | typeof undefined,
    clear_flags: ?number,
    set_flags: ?number,
    master_weight: ?(number | string),
    low_threshold: ?(number | string),
    medium_threshold: ?(number | string),
    high_threshold: ?(number | string),
    home_domain: ?string,
    inflation_destination_account: ?string,
} | {
    type: 'StellarChangeTrustOp',
    source_account?: string,
    asset: StellarAsset,
    limit?: string,
} | {
    type: 'StellarAllowTrustOp',
    source_account?: string,
    trusted_account: string,
    asset_type: number,
    asset_code: string,
    is_authorized: ?number,
} | {
    type: 'StellarAccountMergeOp',
    source_account?: string,
    destination_account: string,
} | {
    type: 'StellarManageDataOp',
    source_account?: string,
    key: string,
    value: string | Buffer | typeof undefined,
} | {
    type: 'StellarBumpSequenceOp',
    source_account?: string,
    bump_to: number,
}

// Tezos types
export type TezosAddress = {
    address: string,
};

export type TezosPublicKey = {
    public_key: string,
};

type TezosContractID = {
    tag: number,
    hash: Uint8Array,
};

export type TezosRevealOp = {
    source: Uint8Array,
    fee: number,
    counter: number,
    gas_limit: number,
    storage_limit: number,
    public_key: Uint8Array,
};

export type TezosParametersManager = {
    set_delegate?: Uint8Array,
    cancel_delegate?: boolean,
    transfer?: TezosManagerTransfer,
};

export type TezosManagerTransfer = {
    amount: number,
    destination: TezosContractID,
};

export type TezosParametersManager = {
    set_delegate?: Uint8Array,
    cancel_delegate?: boolean,
    transfer?: TezosManagerTransfer,
};

export type TezosTransactionOp = {
    source: Uint8Array,
    destination: TezosContractID,
    amount: number,
    counter: number,
    fee: number,
    gas_limit: number,
    storage_limit: number,
    parameters?: Array<number>,
    parameters_manager?: TezosParametersManager,
};

export type TezosOriginationOp = {
    source: Uint8Array,
    balance: number,
    delegate?: Uint8Array,
    fee: number,
    counter: number,
    gas_limit: number,
    storage_limit: number,
    script: Array<number>,
};

export type TezosDelegationOp = {
    source: Uint8Array,
    delegate: Uint8Array,
    fee: number,
    counter: number,
    gas_limit: number,
    storage_limit: number,
};

export type TezosTransaction = {
    address_n: Array<number>,
    branch: Uint8Array,
    reveal?: TezosRevealOp,
    transaction?: TezosTransactionOp,
    origination?: TezosOriginationOp,
    delegation?: TezosDelegationOp,
};

export type TezosSignedTx = {
    signature: string,
    sig_op_contents: string,
    operation_hash: string,
};

// Cardano types
export type CardanoAddress = {
    address: string,
    address_n?: Array<number>,
};

export type CardanoPublicKey = {
    xpub: string,
    node: HDPubNode,
};

export type CardanoSignedTx = {
    tx_hash: string,
    tx_body: string,
};
export type CardanoTxInput = {
    tx_hash: string,
    address_n: Array<number>,
    output_index: number,
    type?: number,
};
export type CardanoTxOutput = {
    address?: string,
    address_n?: Array<number>,
    amount: string,
};

export type CardanoTxRequest = {
    tx_index: number,
    tx_hash: string,
    tx_body: string,
};

// Lisk types
export type LiskAddress = {
    address: string,
}

export type LiskPublicKey = {
    public_key: string,
}

export type LiskMessageSignature = {
    public_key: string,
    signature: string,
};

export type LiskAsset =
    { data: string } |
    { votes: Array<string> } |
    { delegate: { username: string } } |
    { signature: { public_key: string } } |
    {
        multisignature: {
            min: number,
            life_time: number,
            keys_group: Array<string>,
        },
    };

export type LiskTransaction = {
    type: number,
    fee: string,
    amount: string,
    timestamp: number,
    recipient_id?: string,
    sender_public_key?: string,
    requester_public_key?: string,
    signature?: string,
    asset?: LiskAsset,
}

export type LiskSignedTx = {
    signature: string,
}

// Ripple types
export type RippleAddress = {
    address: string,
}

export type RippleTransaction = {
    address_n: Array<number>,
    fee?: number,
    flags?: number,
    sequence?: number,
    last_ledger_sequence?: number,
    payment: {
        amount: string,
        destination: string,
    },
}

export type RippleSignedTx = {
    signature: string,
    serialized_tx: string,
}

// EOS types
export type EosPublicKey = {
    wif_public_key: string,
    raw_public_key: string,
}

export type EosTxActionRequest = {
    data_size: ?number,
}

export type EosTxHeader = {
    expiration: number,
    ref_block_num: number,
    ref_block_prefix: number,
    max_net_usage_words: number,
    max_cpu_usage_ms: number,
    delay_sec: number,
}

export type EosSignTx = {
    address_n: Array<number>,
    chain_id: string,
    header: ?EosTxHeader,
    num_actions: number,
}

export type EosAsset = {
    amount: string, // uint64 as string
    symbol: string, // uint64 as string
}

export type EosPermissionLevel = {
    actor: string, // uint64 as string
    permission: string, // uint64 as string
}

export type EosAuthorizationKey = {
    type: number,
    key: string,
    // address_n?: Array<number>, // this field is not implemented in FW
    weight: number,
}

export type EosAuthorization = {
    threshold: number,
    keys: Array<EosAuthorizationKey>,
    accounts: Array<{
        account: EosPermissionLevel,
        weight: number,
    }>,
    waits: Array<{
        wait_sec: number,
        weight: number,
    }>,
}

export type EosActionCommon = {
    account: string, // uint64 as string
    name: string, // uint64 as string
    authorization: Array<EosPermissionLevel>,
}

export type EosActionTransfer = {
    sender: string, // uint64 as string
    receiver: string, // uint64 as string
    quantity: EosAsset,
    memo?: string,
}

export type EosActionDelegate = {
    sender: string, // uint64 as string
    receiver: string, // uint64 as string
    net_quantity: EosAsset,
    cpu_quantity: EosAsset,
    transfer?: boolean,
}

export type EosActionUndelegate = {
    sender: string, // uint64 as string
    receiver: string, // uint64 as string
    net_quantity: EosAsset,
    cpu_quantity: EosAsset,
}

export type EosActionBuyRam = {
    payer: string, // uint64 as string
    receiver: string, // uint64 as string
    quantity: EosAsset,
}

export type EosActionBuyRamBytes = {
    payer: string, // uint64 as string
    receiver: string, // uint64 as string
    bytes: number,
}

export type EosActionSellRam = {
    account: string, // uint64 as string
    bytes: number,
}

export type EosActionVoteProducer = {
    voter: string, // uint64 as string
    proxy: string, // uint64 as string
    producers: Array<string>, // uint64[] as string
}

export type EosActionRefund = {
    owner: string, // uint64 as string
}

export type EosActionUpdateAuth = {
    account: string, // uint64 as string
    permission: string, // uint64 as string
    parent: string, // uint64 as string
    auth: EosAuthorization,
}

export type EosActionDeleteAuth = {
    account: string, // uint64 as string
    permission: string, // uint64 as string
}

export type EosActionLinkAuth = {
    account: string, // uint64 as string
    code: string, // uint64 as string
    type: string, // uint64 as string
    requirement: string, // uint64 as string
}

export type EosActionUnlinkAuth = {
    account: string, // uint64 as string
    code: string, // uint64 as string
    type: string, // uint64 as string
}

export type EosActionNewAccount = {
    creator: string, // uint64 as string
    name: string, // uint64 as string
    owner: EosAuthorization,
    active: EosAuthorization,
}

export type EosActionUnknown = {
    data_size: number,
    data_chunk: string,
}

export type EosTxActionAck = {
    common?: EosActionCommon,
    transfer?: EosActionTransfer,
    delegate?: EosActionDelegate,
    undelegate?: EosActionUndelegate,
    refund?: EosActionRefund,
    buy_ram?: EosActionBuyRam,
    buy_ram_bytes?: EosActionBuyRamBytes,
    sell_ram?: EosActionSellRam,
    vote_producer?: EosActionVoteProducer,
    update_auth?: EosActionUpdateAuth,
    delete_auth?: EosActionDeleteAuth,
    link_auth?: EosActionLinkAuth,
    unlink_auth?: EosActionUnlinkAuth,
    new_account?: EosActionNewAccount,
    unknown?: EosActionUnknown,
}

export type EosSignedTx = {
    signature: string,
}

// Binance types
export type BinanceAddress = {
    address: string,
}

export type BinancePublicKey = {
    public_key: string,
}

export type BinanceSignTx = {
    address_n: Array<number>,
    msg_count: number,
    chain_id: string,
    account_number: number,
    memo?: string,
    sequence: number,
    source: number,
}

export type BinanceTxRequest = {

}

export type BinanceInputOutput = {
    address: string,
    coins: {
        amount: number,
        denom: string,
    },
}

export type BinanceTransferMsg = {
    inputs: BinanceInputOutput[],
    outputs: BinanceInputOutput[],
}

export type BinanceOrderMsg = {
    id: string,
    ordertype: number, // 'OT_UNKNOWN' | 'MARKET' | 'LIMIT' | 'OT_RESERVED',
    price: number,
    quantity: number,
    sender: string,
    side: number, // 'SIDE_UNKNOWN' | 'BUY' | 'SELL',
    symbol: string,
    timeinforce: number, // 'TIF_UNKNOWN' | 'GTE' | 'TIF_RESERVED' | 'IOC',
}

export type BinanceCancelMsg = {
    refid: string,
    sender: string,
    symbol: string,
}

export type BinanceMessage = BinanceTransferMsg | BinanceOrderMsg | BinanceCancelMsg;

export type BinanceSignedTx = {
    signature: string,
    public_key: string,
}

// GetAddress response
export type Address = {
    address: string,
    path: Array<number>,
    serializedPath: string,
}

// Reset device flags
export type ResetDeviceFlags = {
    display_random?: boolean,
    strength?: number,
    passphrase_protection?: boolean,
    pin_protection?: boolean,
    language?: string,
    label?: string,
    u2f_counter?: number,
    skip_backup?: boolean,
    no_backup?: boolean,
}

export type FirmwareErase = {
    length?: number,
};

export type FirmwareUpload = {
    payload: Buffer,
    length: number,
    // hash?: string,
}

export type ChangePin = {
    remove?: boolean,
}

export type Flags = {
    flags: number,
}

export type DebugLinkDecision = {|
    yes_no?: boolean,
    up_down?: boolean,
    input?: string,
|}

export type DebugLinkState = {
    layout: string,
    pin: string,
    matrix: string,
    mnemonic: string,
    node: HDNode,
    passphrase_protection: boolean,
    reset_word: string,
    reset_entropy: string,
    recovery_fake_word: string,
    recovery_word_pos: number,
    reset_word_pos: number,
}

export type LoadDeviceFlags = {
    mnemonics?: Array<string>,
    mnemonic?: string,
    node?: HDNode,
    pin?: string,
    passphrase_protection?: boolean,
    language?: string,
    label?: string,
    skip_checksum?: boolean,
    u2f_counter?: number,
}
