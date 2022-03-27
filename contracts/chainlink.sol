// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IERC20{
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}


contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    struct swapInfo{
        address owner;
        uint96 amount;
    }

    address MAINNET_USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address MAINNET_INCH = 0x111111111117dC0aa78b770fA6A738034120C302;

    IERC20 USDC = IERC20(MAINNET_USDC);
    IERC20 INCH = IERC20(MAINNET_INCH);

    mapping(uint => swapInfo) orders;

    uint144 orderCounter;
    uint144 decimals = 10**8;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor(address aggregator) {
        priceFeed = AggregatorV3Interface(aggregator);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function swapUSDCforINCH(uint amount) public {
        require(USDC.balanceOf(msg.sender)>= amount, "Insufficent balance");
        swapInfo storage o= orders[orderCounter];
        o.amount= amount;
        o.owner=msg.sender;
        uint decAmount = amount * decimals;
        uint rate = uint(getLatestPrice());
        uint swappedAmount = decAmount * rate;
        require(INCH.balanceOf(address(this))>= (swappedAmount/10**16) , "Insufficent funds");
        USDC.transferFrom(msg.sender, address(this), (swappedAmount/10**16));
        (bool status) = INCH.transfer(msg.sender, (swappedAmount/10**16));
        require(status, "transaction failed");
        orderCounter++;
    } 

    function swapINCHforUSDC(uint amount) public {
        require(INCH.balanceOf(msg.sender)>= amount, "Insufficent balance");
        swapInfo storage o= orders[orderCounter];
        o.amount= amount;
        o.owner=msg.sender;
        uint decAmount = amount * decimals;
        uint rate = uint(getLatestPrice());
        uint swappedAmount = decAmount / rate;
        require(USDC.balanceOf(address(this))>= (swappedAmount/10**16) , "Insufficent funds");
        INCH.transferFrom(msg.sender, address(this), (swappedAmount/10**16));
        (bool status) = USDC.transfer(msg.sender, (swappedAmount/10**16));
        require(status, "transaction failed");
        orderCounter++;
    }

    // function viewRate() public view returns(uint, uint, uint){
    //     return (rate, uint(getLatestPrice()), swappedAmount);
    // }

    // function viewOrder() public view returns(swapInfo memory){
    //     return orders[0];
    // }
}


