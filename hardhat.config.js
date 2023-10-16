require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('@nomicfoundation/hardhat-verify');
require('./tasks/block_number');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-deploy');
require('@nomicfoundation/hardhat-ethers');
require('hardhat-deploy-ethers');

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.9',
            },
            {
                version: '0.6.6',
            }
        ]
    },
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6, // 则表示只有当交易被打包到至少 6 个区块之后，才会认为该交易已被完全确认。
        },
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY
    },
    gasReporter: {
        enabled: true,
        outputFile: 'gas-reporter.txt',
        noColors: true,
        currency: 'USD',
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        }
    },
    mocha: {
        timeout: 500000
    },
};
