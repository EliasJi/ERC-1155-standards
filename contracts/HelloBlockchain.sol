// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract HelloBlockchain is ERC1155, Ownable {

    struct transaction {
        address seller;
        address buyer;
        uint id;
        uint price;
    }

    uint[] private idList;
    mapping(uint256 => address) private _tokenOwners;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private _names;
    mapping(uint256 => string) private _descriptions;
    mapping(uint256 => uint) private _amounts;
    mapping(uint256 => bool) private _sales;
    mapping(uint256 => uint) private _prices;
    transaction[] private _transactionList;


    constructor() ERC1155("") {
    }

    function purchaseNFT(uint id) external payable{
        require(_sales[id] , "The NFT is not for sale");
        require(msg.value == _prices[id], "Incorrect payment amount");
        address payable previousOwner = payable(_tokenOwners[id]);
        address payable newOwner = payable(msg.sender);
        _tokenOwners[id] = newOwner;
        previousOwner.transfer(_prices[id]);
        _transactionList.push(transaction(previousOwner, newOwner, id, _prices[id]));

    }

    function getLastTransaction() public view returns (transaction memory)  {
        require(_transactionList.length > 0, "The list is empty");
        return _transactionList[_transactionList.length - 1];
    }

    function removeNFTFromSale(uint id) external {
        require(msg.sender == _tokenOwners[id], "Only token owner can remove NFT from sale");

        _sales[id] = false;

    }

    function listNFTForSale(uint id, uint price) external {
        require(msg.sender == _tokenOwners[id], "Only token owner can list NFT for sale");

        _sales[id] = true;
        _prices[id] = price;

    }

    function getIsSale(uint id) public view returns (bool) {
        return _sales[id];
    }

    function getPrice(uint id) public view returns (uint) {
        return _prices[id];
    }


    function transferNFT(address _to, uint id) external {
        require(msg.sender == _tokenOwners[id], "Only token owner can transfer ownership");
        _tokenOwners[id] = _to;
    }
    
    function getOwner(uint id) public view returns (address) {
        return _tokenOwners[id];
    }

    function createNFT(uint id, string memory name, string memory description, string memory uri) external onlyOwner {
        idList.push(id);
        _names[id] = name;
        _descriptions[id] = description;
        _tokenOwners[id] = msg.sender;
        _sales[id] = false;
        _mint(msg.sender, id, 1, "");
        _setTokenURI(id, uri);
    }

    function getName(uint id) public view returns(string memory) {
        return _names[id];
    }

    function getDescription(uint id) public view returns(string memory) {
        return _descriptions[id];
    }

    function mint(address to, uint id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
    }

    function burn(address from, uint id, uint256 amount) external {
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "caller is not owner nor approved");
        _burn(from, id, amount);
    }

    function _setTokenURI(uint tokenId, string memory uri) internal virtual {
        _tokenURIs[tokenId] = uri;
        _setURI(uri);
    }

}
