// SPDX-License-Identifier: UNLICENSED
// 1. Pragma
pragma solidity ^0.8.9;
// 2. Imports
import "./price_converter.sol";

// 3. Interfaces, Libraries, Contracts
    error Fund__NoOwner();

/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State variables
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;

    //在 Solidity 中，constant 关键字用于声明一个常量。常量是编译时就确定并且不可更改的值。
    //而 immutable 关键字则用于声明状态变量，表示该变量在合约创建后将不再被修改。
    //
    //因此，在上述代码中，我们应该使用 immutable 关键字来声明 i_owner 变量，
    //因为它在合约创建后不会被修改。而 MINIMUM_USD 常量已经正确地使用了 constant 关键字进行声明。

    address public immutable I_OWNER;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    AggregatorV3Interface private s_priceFeed;

    // Events (we have none!)

    // Modifiers
    //我们使用 if 语句检查 msg.sender 是否等于 i_owner，如果不等于，
    //则触发一个自定义异常 NotOwner()。
    //注意，revert 关键字用于取消当前操作并回滚所有更改。
    modifier OnlyOwner() {
        if (msg.sender != I_OWNER) revert Fund__NoOwner();
        _;
    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address priceFeed) {
        I_OWNER = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }



    function fund() public payable {
        require(msg.value.getConversionRate(s_priceFeed) > MINIMUM_USD, "You need to spend more!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withDraw() public OnlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex ++) {
            s_addressToAmountFunded[funders[funderIndex]] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \
    //         yes  no
    //         /     \
    //    receive()?  fallback()
    //     /   \
    //   yes   no
    //  /        \
    //receive()  fallback()

    // fallback 函数：如果没有匹配到其他函数或无效函数，就会自动执行该函数
    fallback() external payable {
        fund();
    }

    // 当合约收到以太币时，receive 函数将被自动调用，并将转账金额作为函数参数传递给该函数
    receive() external payable {
        fund();
    }

    function getPriceFeed() public view returns (AggregatorV3Interface){
        return s_priceFeed;
    }

    function getOwner() public view returns (address) {
        return I_OWNER;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256)  {
        return s_addressToAmountFunded[fundingAddress];
    }
}