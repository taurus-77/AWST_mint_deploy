//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AWST_NSM is ERC1155, Ownable, Pausable {

    string public name;
    string public symbol;
    string public baseURI;
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) public isAllowedMinter;
    mapping(uint256 => bool) public isDisabled;

    uint256 public currentTokenID;

    modifier onlyMinter() {
        require(
            isAllowedMinter[_msgSender()],
            "ERC1155: Only minters can call this function"
        );
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        bool _isPaused
    ) ERC1155(_baseURI) {
        name = _name;
        symbol = _symbol;
        baseURI = _baseURI;
        isAllowedMinter[_msgSender()] = true;

        if(_isPaused) {
            _pause();
        }
    }

    /**
     * @dev used for setting the base uri of the collection
     */
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    /**
     * @dev disable the transfer of a single token
     */
    function disableSingle(uint256 _tokenID) public onlyOwner {
        isDisabled[_tokenID] = true;
    }

    /**
     * @dev enable the transfer of a single token
     */
    function enableSingle(uint256 _tokenID) public onlyOwner {
        isDisabled[_tokenID] = false;
    }

    /**
     * @dev disable the transfer of all tokens
     */
    function disableCollection() public onlyOwner {
        _pause();
    }

    /**
     * @dev enable the transfer of all tokens
     */
    function enableCollection() public onlyOwner {
        _unpause();
    }

    function uri(uint256 _id) public view override returns (string memory) {
        if (bytes(_tokenURIs[_id]).length > 0) {
            return string(abi.encodePacked(baseURI, _tokenURIs[_id]));
        } else {
            return "";
        }
    }

    function setURI(uint256 _tokenId, string memory _uri) public onlyMinter {
        _tokenURIs[_tokenId] = _uri;
    }

    function setBatchURI(uint256[] memory ids, string[] memory uris)
        public
        onlyMinter
    {
        for (uint256 i = 0; i < ids.length; i++) {
            setURI(ids[i], uris[i]);
        }
    }

    function mint(
        address account,
        uint256 amount,
        string memory _uri,
        bytes memory data
    ) public onlyMinter returns (uint256) {
        uint256 tokenId = _getNextTokenID();
        _mint(account, tokenId, amount, data);
        setURI(tokenId, _uri);
        _incrementTokenId();
        return tokenId;
    }

    function mintBatch(
        address to,
        string[] memory uris,
        uint256[] memory values,
        bytes memory data
    ) public onlyMinter {
        uint256[] memory ids = new uint256[](uris.length);
        for (uint256 i = 0; i < uris.length; i++) {
            ids[i] = _getNextTokenID();
            _incrementTokenId();
        }
        _mintBatch(to, ids, values, data);
        setBatchURI(ids, uris);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override whenNotPaused {
        require(!isDisabled[id], "ERC1155: Transfer disabled for this NFT");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override whenNotPaused {
        
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                !isDisabled[ids[i]],
                "ERC1155: Transfer disabled for one of the NFTs"
            );
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function burn(
        address owner,
        uint256 id,
        uint256 value
    ) public onlyOwner {
        _burn(owner, id, value);
    }

    function burnBatch(
        address owner,
        uint256[] memory ids,
        uint256[] memory values
    ) public onlyOwner {
        _burnBatch(owner, ids, values);
    }

    function addMinter(address account) public onlyOwner {
        isAllowedMinter[account] = true;
    }

    function removeMinter(address account) public onlyOwner {
        isAllowedMinter[account] = false;
    }

    function _getNextTokenID() private view returns (uint256) {
        return currentTokenID + 1;
    }

    /**
     * @dev increments the value of _currentTokenID
     */
    function _incrementTokenId() private {
        currentTokenID++;
    }

}
