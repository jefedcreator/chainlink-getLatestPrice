// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3{

    AggregatorV3Interface internal priceFeed;

    struct swapInfo{
        address swapFrom;
        address swapTo;
        address ownerAddress;
        uint usdcbalance;
        uint ethbalance;
    }

    struct buyerInfo{
        address ownedtoken;
        uint buyAmount;
        uint balance;
        uint usdcbalance;
        uint ethbalance;
    }

    uint decimal = 10**18;

    uint swapId;

    mapping(uint => swapInfo) offer;

    mapping(address => buyerInfo) buyer;

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

    function swapTokens(address _eth, uint _amount, address _usdc, address _owner) public{
        swapInfo storage s = offer[swapId];
        s.swapFrom = _eth;
        s.swapTo = _usdc;
        s.ownerAddress = _owner;
        s.usdcbalance = 0;
        s.ethbalance = _amount;
        swapId++;
    }

    function swapper(uint _swapId, uint _amount, address _buyerAdd, address _usdc) public{
        swapInfo storage sI = offer[_swapId];
        // require(sI.amount, "amount too low");
        uint rate = uint(getLatestPrice());
        uint sendUsdcAmount = rate / _amount;
        uint ethAmount = rate * _amount;
        // IERC20(sI.swapFrom).transfer(sI.ownerAddress, sendAmount);
        // IERC20(sI.swapTo).transferFrom(sI.ownerAddress,msg.sender , _amount);
        buyer[_buyerAdd].ownedtoken = _usdc;
        buyer[_buyerAdd].buyAmount = _amount;
        sI.usdcbalance += sendUsdcAmount;
        buyer[_buyerAdd].usdcbalance -= sendUsdcAmount;
        sI.ethbalance -= ethAmount;
        buyer[_buyerAdd].ethbalance += ethAmount;
    }

    function buyerBal(address _buyerAdd) public view returns(uint){
        return buyer[_buyerAdd].ethbalance;
    }
}
