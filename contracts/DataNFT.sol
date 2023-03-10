// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";


contract DataNFT is ERC721URIStorage, ERC721Royalty {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _dataUrl; // Url of the data stored in ipfs
    string private _name;
    string private _symbol;
    string private _metadata;
    address payable dataCreator;

    address marketplaceAddress;

    constructor(
        address _marketplaceAddress, 
        string memory dataUrl_,
        string memory metadata_
    ) ERC721("Datahotpot NFT", "DNFT") {
        dataCreator = payable(msg.sender);
        marketplaceAddress = _marketplaceAddress;
        _dataUrl = dataUrl_;
        _metadata = metadata_;
    }

    // Upload dataset -> get ipfs link
    // URI contains link to the metadata json file
    // metadata.json file contains
    // name, context, list of files, categories, ...
    // link

    // json 
    // metadata.json -> Upload to ipfs -> link
    // { "name": "", ""}
    // fetch api from link -> get json

    // _tokenURI = { "dataset": "link to ipfs url uploaded", "metadata": "link to ipfs json file" }

    modifier onlyDataCreator {
        require(msg.sender == dataCreator, "Only data creator can do this");
        _;
    }

    function createToken(uint96 _feeNumerator) public onlyDataCreator returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _metadata);
        _setTokenRoyalty(newItemId, dataCreator, _feeNumerator);

        setApprovalForAll(marketplaceAddress, true);

        return newItemId;
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external onlyDataCreator {
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function resetTokenRoyalty(uint256 tokenId) external onlyDataCreator {
        _resetTokenRoyalty(tokenId);
    }

    function getMarketplaceAddress() public view returns (address) {
        return marketplaceAddress;
    }

    function getDataUrl(uint256 tokenId) public view returns (string memory) {
        // Only owner of this contract can do this function
        require(ownerOf(tokenId) == msg.sender, "Only token owner can get data url");
        return _dataUrl;
    }

    function getMetadata() public view returns (string memory) {
        return _metadata;
    }


    // Override functions
    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721Royalty, ERC721URIStorage) {
        ERC721URIStorage._burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Royalty) returns (bool) {
        return ERC721Royalty.supportsInterface(interfaceId);
    }
}