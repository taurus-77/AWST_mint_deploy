const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider"); //HD Wallet provider
const web3 = require("web3");

// Read XL data
var XLSX = require("xlsx");
// var workbook = XLSX.readFile("../nft_token_mapping.xlsx");
var tokensJSON = require("./ids.json");
// var sheets = workbook.SheetNames;
// var xlRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheets[0]]);

// Read config file
var network = "mumbai";
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
    // if (NFT_CONTRACT_ADDRESS) {
    //     nftContract = new web3Instance.eth.Contract(AWST_ERC1155_ABI, NFT_CONTRACT_ADDRESS);

    //     nftSocket = new web3SocketInstance.eth.Contract(AWST_ERC1155_ABI, NFT_CONTRACT_ADDRESS);

    //     // BatchMint event catch
    //     nftSocket.events
    //         .TransferBatch({}, (error, event) => {})
    //         .on("data", (event) => {
    //             console.log("ID's minted : " + JSON.stringify(event.returnValues.ids));
    //         })
    //         .on("changed", (event) => {
    //             console.log("Changed !!! ID's minted : " + JSON.stringify(event));
    //         })
    //         .on("error", console.error);
    // } else {
    //     console.error("Add NFT_CONTRACT_ADDRESS ");
    // }
};

const mintBatch = async function (tokenIds, tokenCount, tokenURIs, isRevealed, values) {
    await nftContract.methods
        .mintBatch(OWNER_ADDRESS, tokenCount, tokenURIs, values, isRevealed, "0x0")
        .send({ from: OWNER_ADDRESS, chainId: 80001 })
        .then(async (result) => {
            console.log("https://mumbai.polygonscan.com/tx/" + result.transactionHash);
            let tokenObj = {};
            for (let i = 0; i < tokenIds.length; i++) {
                tokenObj[tokenIds[i]] = tokenURIs[i];
            }
            batchTxs.push({ txHash: result.transactionHash, mintedTokens: tokenObj });
        })
        .catch((error) => console.log(error));
};

const main = async () => {
    await fs.writeFile("mintedTokens.json", "", (err) => {
        console.log(err);
    });
    await setUpWeb3();
    for (let i = 0; i < 100; i += 50) {

        let tokenCount = 50;

        let tokenURIs = [];
        let tokenIds = [];
        let NFT_URI = "QmeDLute7gsT1idhy3dZhv3TKVmLyUf9yFFej7SnP3sssv/Woke%20Workaholic%20%23"


        for (j = 1 + i; j <= 50 + i; j++) {
            tokenURIs.push(NFT_URI + `${j}.json`);
            tokenIds.push(j);
        }

        let values = Array(tokenCount).fill(1);
        let isRevealed = Array(tokenCount).fill("true");

        // call batch mint function
        await mintBatch(tokenIds, tokenCount, tokenURIs, isRevealed, values);
    }

    await fs.appendFileSync(fileName, JSON.stringify(batchTxs, null, 2), "utf-8", (err) => {
        if (err) throw err;
    });
};

main();
