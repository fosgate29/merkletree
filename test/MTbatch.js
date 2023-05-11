const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const fixtures = require('./fixtures');

const { expect } = require('chai');

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');

describe('MTBatch contract', function () {
  /* Simple test 
	└─ ec17b6e2eb34917be3a975b67931380f7437fd3c9768f927c2db4025bc9d0fc9   // Proof
   ├─ 9da137fb3ca535f5dfcc27f9f4cf8ac9f375dca42354212f8545244ee36eabea  // address 0x5b38da6a701c568545dcfcb03fcb875f56beddc4
   └─ cd058cf3a7e182fbad392721ca38cc12de70e15a9e4cd10ce1ac83bd9e0adaa5  // address 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
	*/
  it('Should be able to set proof root and call transfer', async function () {
    const { token, owner, addr2, addr3, addr4 } = await loadFixture(fixtures.deployTokenFixture);

    const addr = '0x5b38da6a701c568545dcfcb03fcb875f56beddc4';
    let balanceOf = await token.balanceOf(addr2.address);
    expect(balanceOf).to.equal(0);

    await token.setProof('0xec17b6e2eb34917be3a975b67931380f7437fd3c9768f927c2db4025bc9d0fc9');

    // send hash of 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 + 500
    let tx = await token.executeTransfer(
      ['0xcd058cf3a7e182fbad392721ca38cc12de70e15a9e4cd10ce1ac83bd9e0adaa5'],
      addr,
      500
    );

    balanceOf = await token.balanceOf(addr);
    expect(balanceOf).to.equal(500);
  });
});
