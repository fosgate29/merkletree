const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');
const keccak256 = require('keccak256');
const ethers = require('ethers');
const fs = require('fs');

let hashes = [];

// hash each transfer tx
let finalHash;

const values = [];

finalHash = keccak256(
  '0x5b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000001f4'
);

let tupla = ethers.utils.solidityPack(
  ['bytes32', 'address', 'uint256'],
  [finalHash, '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 500]
);

finalHash = keccak256(tupla);

hashes.push('0x' + finalHash.toString('hex'));

values.push(hashes);
console.log(values);

for (let i = 1; i < 4; i++) {
  let newAddress = ethers.Wallet.createRandom().address;
  let amount = i;
  tupla = ethers.utils.solidityPack(['address', 'uint256'], [newAddress, amount]);
  finalHash = keccak256(tupla);

  for (let j = 1; j < 7; j++) {
    newAddress = ethers.Wallet.createRandom().address;
    amount = i + j;
    tupla = ethers.utils.solidityPack(['bytes32', 'address', 'uint256'], [finalHash, newAddress, amount]);
    finalHash = keccak256(tupla);
  }

  hashes = [];
  hashes.push('0x' + finalHash.toString('hex'));
  values.push(hashes);
}

const tree = StandardMerkleTree.of(values, ['bytes32']);

//console.log('Merkle Root:', tree.root);

for (const [i, v] of tree.entries()) {
  if (v[0] === '0xbc4b8c6cc50f1918f2c33031c8b93ea7b400500474068e5bec1dba708e3f8ef6') {
    //console.log(i);
    const proof = tree.getProof(i);
    console.log('Proof:', proof);
  }
}

const proof = tree.getProof(0);
const verified = StandardMerkleTree.verify(
  tree.root,
  ['bytes32'],
  ['0xbc4b8c6cc50f1918f2c33031c8b93ea7b400500474068e5bec1dba708e3f8ef6'],
  proof
);

console.log(verified);
console.log(tree.render());
