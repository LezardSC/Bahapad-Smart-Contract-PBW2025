// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
    address: string,
    name: string,
    owner: string,
    symbol: string,
    url: string,
    description: string,
    supply: number
    launchDate: number
*/

contract Token is ERC20 {

    address public immutable creator;
    string public immutable image;
    string public immutable description;
    uint256 public immutable launchTimestamp;

    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        string memory _image,
        string memory _description
    ) ERC20(_name, _symbol) {
        creator = _creator;
        image = _image;
        description = _description;
        launchTimestamp = block.timestamp;

        _mint(creator, _totalSupply);
    }
}