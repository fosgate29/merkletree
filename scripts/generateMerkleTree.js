const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const ethers = require('ethers');

let leaves = []; // = ['0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', 'b', 'c'];

/*for (let i = 1; i < 2; i++) {
  const newAddress = ethers.Wallet.createRandom().address;
  const amount = i;
  const tupla = ethers.solidityPacked(['address', 'uint256'], [newAddress, amount]);
  leaves.push(tupla);
}*/

leaves.push(
  '0x5b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000001f4'
);

leaves.push(
  '0xab8483f64d9c6d1ecf9b849ae677dd3315835cb200000000000000000000000000000000000000000000000000000000000001f4'
);

leaves = leaves.map((x) => keccak256(x));

const tree = new MerkleTree(leaves, keccak256);
console.log(tree.toString());

const root = tree.getRoot(); //.toString('hex');

console.log('root - ', root.toString('hex'));

const leaf = keccak256(
  '0xab8483f64d9c6d1ecf9b849ae677dd3315835cb200000000000000000000000000000000000000000000000000000000000001f4'
);

console.log(leaf.toString('hex'));

const proof = tree.getProof(leaf);
console.log(proof);
console.log('proof', proof[0].data.toString('hex'));

console.log(tree.verify(proof, leaf, root)); // true

//console.log(
//  keccak256(
////    '0x5b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000001f4'
//).toString('hex')
//);
//console.log(keccak256('hello').toString('hex'));

//console.log(
// ethers.keccak256(
//   '0x5b38da6a701c568545dcfcb03fcb875f56beddc400000000000000000000000000000000000000000000000000000000000001f4'
// )
//);

//console.log(ethers.keccak256('0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'));

const addr = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
const aa = ethers.solidityPacked(['address', 'uint'], [addr, 500]);

//console.log(ethers.keccak256(aa));
