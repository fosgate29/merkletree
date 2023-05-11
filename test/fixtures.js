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

  // Fixtures can return anything you consider useful for your tests
  return { MTbatch, token, owner, unauthorisedUser, addr2, addr3, addr4 };
}

module.exports = {
  deployTokenFixture
};
