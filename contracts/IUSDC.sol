// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface iERC20{
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
     function allowance(address owner, address spender) external view returns (uint256);
}