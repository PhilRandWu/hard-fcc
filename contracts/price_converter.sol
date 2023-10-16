// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {

    // 获取 eth 价格
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
//    用于限制函数或状态变量只能在当前合约内部被访问
// Sepolia ETH / USD Address
// https://docs.chain.link/data-feeds/price-feeds/addresses#Sepolia%20Testnet

// 创建 AggregatorV3Interface 实例，并将其初始化为特定的智能合约地址

        (,int256 answer,,,) = priceFeed.latestRoundData();
        return uint256(answer * 10000000000);  // 10**10
    }

    // 将 eth 转换为 USD
    function getConversionRate(uint256 ethAmount, AggregatorV3Interface s_priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(s_priceFeed);
        return (ethPrice * ethAmount) / 1 * 1000000000000000000;
    }
}