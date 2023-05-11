const { StandardMerkleTree } = require('@openzeppelin/merkle-tree');

const values = [
  ['0x1111111111111111111111111111111111111111', '5000000000000000000'],
  ['0x2222222222222222222222222222222222222222', '2500000000000000000']
];

// (2)
const tree = StandardMerkleTree.of(values, ['address', 'uint256']);

// (3)
console.log('Merkle Root:', tree.root);
