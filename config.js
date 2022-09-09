const secret = require("./secret.json");

module.exports = {
    development: {
        network: "development",
        chainId: "",
        mnemonic: secret.mnemonic,
        infura_key: secret.infuraKey,
        nft_contract_address: "0x0f818d725519e77D424B1b1C8dFB08A8851752F2",
        owner_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
    },
    mumbai: {
        network: "mumbai",
        chainId: 80001,
        rpc_provider: "https://rpc-mumbai.maticvigil.com/",
        mnemonic: secret.mnemonic,
        infura_key: secret.infuraKey,
        nft_contract_address: "0xC29454B47F010b97882f876e311871b926b19F6e",
        owner_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
    },
    maticmainnet: {
        network: "mainnet",
        chainId: 137,
        rpc_provider:
            "https://speedy-nodes-nyc.moralis.io/e3771a4194ca1a8d20c96277/polygon/mainnet",
        mnemonic: secret.mnemonic,
        infura_key: secret.infuraKey,
        nft_contract_address: "",
        owner_address: "",
    },
};
