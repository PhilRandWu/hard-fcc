const { network, deployments, getNamedAccounts, ethers } = require('hardhat');
const { assert, expect } = require('chai');
const { developmentChains } = require('../../config/network');


!developmentChains.includes(network.name) ? describe.skip :
    describe('FundMe', () => {
        let fundMe;
        let deployer;
        let mockV3Aggregator;
        const sendValue = ethers.parseEther('1');

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(['all']);
            // fundMe = await ethers.getContract('FundMe', deployer);
            fundMe = await ethers.getContract('FundMe', deployer);
            mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer);
        });

        describe('constructor', () => {
            it('sets the aggregator addresses correctly', async () => {
                const resp = await fundMe.getPriceFeed();
                assert.equal(resp.target, mockV3Aggregator.address);
            });
        });

        describe('fund', () => {
            it('Fails if you don\'t send enough ETH', async () => {
                await expect(fundMe.fund()).to.be.revertedWith('You need to spend more!');
            });

            it('Updates the amount funded data structure', async () => {
                await fundMe.fund({ value: sendValue });
                const resp = await fundMe.getAddressToAmountFunded(deployer);
                assert.equal(resp.toString(), sendValue.toString());
            });

            it('Adds funder to array of funders', async () => {
                await fundMe.fund({ value: sendValue });
                const resp = await fundMe.getFunder(0);
                assert.equal(resp.toString(), deployer.toString());
            });
        });

        describe('withDraw', () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue });
            });

            it('withdraws ETH from a single funder', async () => {
                // Arrange
                const StartFundMeContractBalance = await ethers.provider.getBalance(fundMe.target);
                const StartDeployBalance = await ethers.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.withDraw();
                const transactionReceipt = await transactionResponse.wait();
                const { gasUsed, gasPrice } = transactionReceipt;
                const gasCost = gasUsed * gasPrice;

                const EndFundMeContractBalance = await ethers.provider.getBalance(fundMe.target);
                const EndDeployBalance = await ethers.provider.getBalance(deployer);

                // Assert
                assert.equal(EndFundMeContractBalance, 0);
                assert.equal(StartFundMeContractBalance + StartDeployBalance, EndDeployBalance + gasCost);
            });
            it('is allows us to withdraw with multiple funders', async () => {
                const accounts = await ethers.getSigners();
                for (i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                    await fundMeConnectedContract.fund({ value: sendValue });
                }

                // Arrange
                const StartFundMeContractBalance = await ethers.provider.getBalance(fundMe.target);
                const StartDeployBalance = await ethers.provider.getBalance(deployer);

                // Act
                const transactionResponse = await fundMe.withDraw();
                const transactionReceipt = await transactionResponse.wait();
                const { gasUsed, gasPrice } = transactionReceipt;
                const gasCost = gasUsed * gasPrice;

                const EndFundMeContractBalance = await ethers.provider.getBalance(fundMe.target);
                const EndDeployBalance = await ethers.provider.getBalance(deployer);

                // Assert
                assert.equal(EndFundMeContractBalance, 0);
                assert.equal(StartFundMeContractBalance + StartDeployBalance, EndDeployBalance + gasCost);

                // Make a getter for storage variables
                await expect(fundMe.getFunder(0)).to.be.reverted;

                for (i = 1; i < 6; i++) {
                    assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0);
                }
            });

            it('Only allows the owner to withdraw', async function() {
                const accounts = await ethers.getSigners();
                const fundMeConnectedContract = await fundMe.connect(accounts[1]);
                await expect(fundMeConnectedContract.withDraw()).to.be.revertedWithCustomError(fundMe, 'Fund__NoOwner');
            });
        });

    });