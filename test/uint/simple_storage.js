const hre = require('hardhat');
const { assert } = require('chai');

describe('test simple storage contract',  () => {
    let SimpleStorage;

    beforeEach(async () => {
        SimpleStorage = await hre.ethers.deployContract('SimpleStorage');
        await SimpleStorage.waitForDeployment();
        console.log('SimpleStorage Contract address', SimpleStorage.target);
    });

    it('test init value', async () => {
        const current_value = await SimpleStorage.retrieve();
        assert.equal(current_value, 0);
    });

    it('update value', async () => {
        await SimpleStorage.store(8);
        const update_value = await SimpleStorage.retrieve();
        assert.equal(update_value, 8);
    });
});
