# merkletree

Merkle Tree POC

Setup:
npm install

To compile contract:
npx hardhat compile

To test contract:
npx hardhat test

--

Here is how I developed it.
First I created a small POC for one transaction only. The main documentation
I used was from here: https://github.com/WallStFam/gas-optimization/blob/master/scripts/vsMerkle.js

I had to create a POC for a client in the past for a whitelist smart contract.

After I was able to setup and run a test, I started adding multiple transfers in one transaction

I has some problems since the hash the javascript was creating were different from what Smart Contract
was creating. After hours debuging and no success, I checked OpenZeppelin MerkleTree library
and tried to see how their example was. After more hours testing and debuging, I found out
that I had to add a "0x" text when hashing using javscript.

My solution was to create a Merkle Tree where each leaf was a hash. A Leaf
were a hash of wallets and amounts for the transfers.
