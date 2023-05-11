const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');

const roots = [];
const trees = [];
const hashes = [];

// hash each transfer tx
let finalHash;

finalHash = keccak256(
  '0x5b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000001f4'
);

let tupla = ethers.utils.solidityPack(
  ['bytes32', 'address', 'uint256'],
  [finalHash, '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 500]
);

finalHash = keccak256(tupla);

hashes.push(finalHash.toString('hex'));

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

  hashes.push(finalHash.toString('hex'));
}

const tree = new MerkleTree(hashes, keccak256);
console.log(tree.toString());

const root = tree.getRoot(); //.toString('hex');
console.log('root - ', root.toString('hex'));

// let's create a merkle tree with merkle tree roots

const leaf = hashes[0];
console.log('leaf ', leaf.toString('hex'));
const proof = tree.getProof(leaf);
console.log('p1', proof[0].data.toString('hex'));
console.log('p2', proof[1].data.toString('hex'));

console.log(tree.verify(proof, leaf, root));
