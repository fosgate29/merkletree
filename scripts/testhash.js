const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');

// hash each transfer tx
let finalHash;

let tupla = ethers.utils.solidityPack(
  ['bytes32', 'bytes32'],
  [
    '0xbc4b8c6cc50f1918f2c33031c8b93ea7b400500474068e5bec1dba708e3f8ef6',
    '0x17a9a1c28112f9d1a9234400cdeff0fcc07363f50bcb3940f0b36ea198666c2e'
  ]
);

finalHash = keccak256(tupla);

console.log(finalHash.toString('hex'));
