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
        nft_contract_address: "0x24054ab504C8B25558d214E77a53aD5509c7EcA7",
        owner_address: "0x1C4A0724DC884076B9196FFf7606623409613Adf",
    },
    maticmainnet: {
        network: "mainnet",
        chainId: 137,
        rpc_provider: "https://rpc-mainnet.maticvigil.com/",
        mnemonic: secret.mnemonic,
        infura_key: secret.infuraKey,
        nft_contract_address: "",
        owner_address: "",
    },
};
