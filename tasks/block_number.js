const { task } = require('hardhat/config');

task('block_number', 'Prints current block number').setAction(async (taskArgs, env) => {
    const curent_block_number = await env.ethers.provider.getBlockNumber();
    console.log(`current number is ${curent_block_number}`);
});

module.exports = {};
