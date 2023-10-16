const hre = require('hardhat');

async function main() {
    // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    // const unlockTime = currentTimestampInSeconds + 60;
    //
    // const lockedAmount = hre.ethers.parseEther("0.001");
    //
    // const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    //   value: lockedAmount,
    // });

    // await lock.waitForDeployment();

    // console.log(
    //   `Lock with ${ethers.formatEther(
    //     lockedAmount
    //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
    // );
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await verify(SimpleStorage.target, []);
    }
}

async function verify(contractAddress, args) {
    console.log('verifying contract...');
    try {
        await hre.run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('contract verified!');
        } else {
            console.log(e);
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
