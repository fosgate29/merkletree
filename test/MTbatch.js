const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const fixtures = require('./fixtures');

const { expect } = require('chai');

const keccak256 = require('keccak256');
const ethers = require('ethers');
const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');

describe('MTBatch contract', function () {
  /* Simple test 
    0) 2d367c5723f6640dc5d3c8f0f114a520e8942969627fa8d50598ce7608c993f6   - Root
    ├─ 1) 5b4630a9af86d430e296f53812358c8c5b5d2ead3c79d3212188c8331c447726    - Proof 1
    │  ├─ 3) edb77a3793b9039b821555a27afd4f36519c8e3e5a99ce0595390833093daf12
    │  └─ 4) aee0c798b225a78c7a45b2b42284b62ca5f71fa1da62ee313e9d0fe6f11461a0
    └─ 2) b79b122e6d2548fd47d3dd45487d925cda47ae28f1eeb30edc9dc2807c87a581
      ├─ 5) a7b2b26f7fd35049e118ad94a9bbd78c3e63b054701930bba1455465f54b8d82  - Proof 2
      └─ 6) 96f62e27e9cb7e8d94a912ef3b5ee0da0a51b925fee81670bdeb7b4bc0d39c6d

    Proof: [
    'a7b2b26f7fd35049e118ad94a9bbd78c3e63b054701930bba1455465f54b8d82',
    '5b4630a9af86d430e296f53812358c8c5b5d2ead3c79d3212188c8331c447726'
      ]
	*/
  it('Should be able to set proof root and call transfer', async function () {
    const { token, owner, addr2, addr3, addr4 } = await loadFixture(fixtures.deployTokenFixture);

    const addr = '0x5b38da6a701c568545dcfcb03fcb875f56beddc4';
    let balanceOf = await token.balanceOf(addr2.address);
    expect(balanceOf).to.equal(0);

    await token.setRoot('0x2d367c5723f6640dc5d3c8f0f114a520e8942969627fa8d50598ce7608c993f6');

    let tx = await token.executeTransfer(
      [
        '0xa7b2b26f7fd35049e118ad94a9bbd78c3e63b054701930bba1455465f54b8d82',
        '0x5b4630a9af86d430e296f53812358c8c5b5d2ead3c79d3212188c8331c447726'
      ],
      ['0x5b38da6a701c568545dcfcb03fcb875f56beddc4', '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'],
      [500, 500]
    );

    balanceOf = await token.balanceOf(addr);
    expect(balanceOf).to.equal(500);
  });

  it('Should fail if amount is not correct', async function () {
    const { token, owner, addr2, addr3, addr4 } = await loadFixture(fixtures.deployTokenFixture);

    const addr = '0x5b38da6a701c568545dcfcb03fcb875f56beddc4';
    let balanceOf = await token.balanceOf(addr2.address);
    expect(balanceOf).to.equal(0);

    await token.setRoot('0x2d367c5723f6640dc5d3c8f0f114a520e8942969627fa8d50598ce7608c993f6');

    await expect(
      token.executeTransfer(
        [
          '0xa7b2b26f7fd35049e118ad94a9bbd78c3e63b054701930bba1455465f54b8d82',
          '0x5b4630a9af86d430e296f53812358c8c5b5d2ead3c79d3212188c8331c447726'
        ],
        ['0x5b38da6a701c568545dcfcb03fcb875f56beddc4', '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'],
        [500, 100]
      )
    ).to.be.revertedWith('Invalid proof');
  });

  it('Should be able to set proof root and call transfer from ', async function () {
    const { token, owner, addr2, allWallets, allAmounts } = await loadFixture(fixtures.deployTokenFixture);

    const values = [];
    for (let i = 0; i < allWallets.length; i++) {
      let addresses = allWallets[i];
      let amounts = allAmounts[i];

      // 1st item
      let tupla = ethers.utils.solidityPack(['address', 'uint256'], [addresses[0], amounts[0]]);
      let finalHash = keccak256(tupla);

      for (let j = 1; j < addresses.length; j++) {
        tupla = ethers.utils.solidityPack(
          ['bytes32', 'address', 'uint256'],
          [finalHash, addresses[j], amounts[j]]
        );

        finalHash = keccak256(tupla);
      }

      hashes = [];
      hashes.push('0x' + finalHash.toString('hex'));
      values.push(hashes);
    }

    const tree = StandardMerkleTree.of(values, ['bytes32']);

    await token.setRoot(tree.root);

    // get hash for wallet #4
    let index = 4;
    let addresses = allWallets[index];
    let amounts = allAmounts[index];

    // 1st item
    let tupla = ethers.utils.solidityPack(['address', 'uint256'], [addresses[0], amounts[0]]);
    let finalHash = keccak256(tupla);

    for (let j = 1; j < addresses.length; j++) {
      tupla = ethers.utils.solidityPack(
        ['bytes32', 'address', 'uint256'],
        [finalHash, addresses[j], amounts[j]]
      );

      finalHash = keccak256(tupla);
    }

    const searchHash = '0x' + finalHash.toString('hex');

    for (const [i, v] of tree.entries()) {
      if (v[0] === searchHash) {
        const proof = tree.getProof(i);

        let balanceOf = await token.balanceOf(addresses[0]);
        expect(balanceOf).to.equal(0);

        await token.executeTransfer(proof, addresses, amounts);

        balanceOf = await token.balanceOf(addresses[0]);
        expect(balanceOf).to.equal(amounts[0]);
      }
    }
  });
});
