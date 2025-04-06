// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {

    event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol, uint256 totalSupply, string image, string description, uint256 timestamp);

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        string memory _image,
        string memory _description
    ) external payable returns (address) {

        Token token = new Token(msg.sender, _name, _symbol, _totalSupply, _image, _description);
        emit TokenCreated(address(token), msg.sender, _name, _symbol, _totalSupply, _image, _description, block.timestamp);
        
        return address(token);
    }

}
