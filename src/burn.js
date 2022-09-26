const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const web3 = require("web3");


// Read config file
var network = "mainnet";
const config = require("../config")[network];

// Read config variables
const MNEMONIC = config.mnemonic; //wallet MNEMONIC
const NFT_CONTRACT_ADDRESS = config.nft_contract_address; //polygon (mumbai) testnet deployed
const OWNER_ADDRESS = config.owner_address; // smart contract owner

// ABI used to encode information while interacting onchain smart contract functions
const AWST_ERC1155_ABI = require("./AWSTERC1155.json").abi;

// Output file
const fileName = "mintedTokens.json";
var batchTxs = [];


if (!MNEMONIC || !OWNER_ADDRESS) {
    console.error(
        "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
    );
    return;
}

let provider;
let web3Instance;
let nftContract;

// let web3SocketInstance;

const setUpWeb3 = async function () {
    provider = new HDWalletProvider(
        MNEMONIC,
        config.rpc_provider //RPC testnet endpoint
    );

    web3Instance = new web3(provider); //create a web3 instance
    nftContract = new web3Instance.eth.Contract(AWST_ERC1155_ABI, NFT_CONTRACT_ADDRESS);
};

const burnBatch = async function (tokenIds, values) {
    await nftContract.methods
    .burnBatch(OWNER_ADDRESS, tokenIds, values)
    .send({ from: OWNER_ADDRESS, chainId: 137 })
    .then(async (result) => {
        console.log("https://polygonscan.com/tx/" + result.transactionHash);
    })
    .catch((error) => console.log(error));
}


const main = async () => {

    await setUpWeb3();

    let totalNFTs = 850;

    for (let i = 0; i < totalNFTs; i += 50) {

        let tokenCount = 50;

        let tokenIds = [];

        for (j = 1 + i; j <= 50 + i; j++) {
            tokenIds.push(j);
        }

        let values = Array(tokenCount).fill(1);

        // call batch burn function
        await burnBatch(tokenIds, values);
    }

};

main();
