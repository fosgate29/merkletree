/**
 * This file contains steps of functionality that can be combined to create test fixtures
 * See: https://hardhat.org/tutorial/testing-contracts#reusing-common-test-setups-with-fixtures
 */

const { ethers } = require('hardhat');

async function deployTokenFixture() {
  const MTbatch = await ethers.getContractFactory('MTbatch');
  const [owner, unauthorisedUser, addr2, addr3, addr4] = await ethers.getSigners();

  const token = await MTbatch.deploy();

  await token.deployed();

  const allWallets = [];
  const allAmounts = [];
  for (let i = 1; i < 6; i++) {
    const wallets = [];
    const amounts = [];
    for (let j = 1; j < 8; j++) {
      let newAddress = ethers.Wallet.createRandom().address;
      wallets.push(newAddress);
      amounts.push(j + i);
    }
    allWallets.push(wallets);
    allAmounts.push(amounts);
  }

  // Fixtures can return anything you consider useful for your tests
  return { MTbatch, token, owner, unauthorisedUser, addr2, addr3, addr4, allWallets, allAmounts };
}

module.exports = {
  deployTokenFixture
};
