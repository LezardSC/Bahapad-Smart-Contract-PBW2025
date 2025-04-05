// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Token} from "./Token.sol";

contract TokenFactory {
    address public immutable owner;
    uint256 public creationFee;
    address[] private tokens;

    event TokenCreated(address indexed tokenAddress, address indexed creator, string name, string symbol);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(uint256 _creationFee) {
        owner = msg.sender;
        creationFee = _creationFee;
    }

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) external payable returns (address) {
        require(msg.value >= creationFee, "Factory: Fee not paid");

        Token token = new Token(msg.sender, _name, _symbol, _totalSupply);

        tokens.push(address(token));

        emit TokenCreated(address(token), msg.sender, _name, _symbol);
        
        return address(token);
    }

    function getAllTokens() external view returns (address[] memory) {
        return tokens;
    }

    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
