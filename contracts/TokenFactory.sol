// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {
    address public immutable owner;
    address[] private tokens;

    event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        string memory _image,
        string memory _description
    ) external payable returns (address) {

        Token token = new Token(msg.sender, _name, _symbol, _totalSupply, _image, _description);

        tokens.push(address(token));

        emit TokenCreated(address(token), msg.sender, _name, _symbol);
        
        return address(token);
    }

    function getAllTokens() external view returns (address[] memory) {
        return tokens;
    }
}
