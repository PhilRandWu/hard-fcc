const { network, deployments, getNamedAccounts, ethers } = require('hardhat');
const { assert, expect } = require('chai');
const { developmentChains } = require('../../config/network');

developmentChains.includes(network.name) ? describe.skip :
    describe('fundMe', () => {
        let deployer;
        let fundMe;
        let sendValue = ethers.parseEther('1');

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract('fundMe', deployer);
        });

        it('allows people to fund and withdraw', async () => {
            const fundTxResponse = await fundMe.fund({ value: sendValue });
            await fundTxResponse.wait(1);
            const withdrawTxResponse = await fundMe.withDraw();
            await withdrawTxResponse.wait(1);

            const endingFundMeBalance = await ethers.provider.getBalance(fundMe.target);

            console.log(
                endingFundMeBalance.toString() +
                ' should equal 0, running assert equal...',
            );
            assert.equal(endingFundMeBalance.toString(), '0');
        });

    });