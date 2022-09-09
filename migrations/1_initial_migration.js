const ERC1155 = artifacts.require("AWST_NSM");

module.exports = async function (deployer, network) {
    if (network === "development") {

    }

    if (network === "mumbai") {

        let _name = "AWST_NSM";
        let _symbol = "AWST_NSM";
        let _baseURI = "https://artwallstreet.mypinata.cloud/ipfs/";
        let _isPaused = true;

        await deployer.deploy(ERC1155, _name, _symbol, _baseURI, _isPaused);
    }

};
