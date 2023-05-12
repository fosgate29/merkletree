// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MTbatch is ERC20, Ownable {

    /// @notice Store Merkle Tree Root
    bytes32 public root;

    /// @notice Create a simple ERC20 token. Smart contract is the owner of all tokens
    constructor() ERC20("Token", "TKN"){
        _mint(address(this), 10 * 2**8);
    }

    /**
     * @param proof - Merkle Tree Proof
     * @param users - List of users that will receive tokens
     * @param amounts - List of token amounts for each transfer
     */
    function executeTransfer(bytes32[] calldata proof,  address[] calldata users, uint256[] calldata amounts) external  {
        
        require(users.length > 0, "Size cant be zero");
        require(users.length == amounts.length, "Different array size");

        // Leaf is the hash of all transfer it should execute
        bytes32 leaf = getLeaf(users, amounts);
        leaf = keccak256(bytes.concat(keccak256(abi.encode(leaf))));

        // Check if the Proof and the Leaf are from the Root
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");

        // Transfer tokens to the users list
        address from = address(this);
        for(uint256 i=0; i<users.length ; i++){
            _transfer(from, users[i], amounts[i]);
        }
    }

    /// @notice Merkle proof of token amounts assigned to different addresses
    function setRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }

    /**
     * First it hash a wallet and the amount it will receive. The result is hashed
     * in a loop for each wallet and amount. The result is a hash that is a leaf of the Merkle Tree
     * @param users - List of users that will receive tokens
     * @param amounts - List of amounts of each wallet will receive
     */
    function getLeaf(address[] calldata users, uint256[] calldata amounts) pure public returns (bytes32)
    {
        // Hash wallet and amount
        bytes32 leaf = keccak256(abi.encodePacked(users[0], amounts[0]));

        // Hash the result above with the reamining wallets/amounsts
        if(users.length > 1){
            for(uint256 i=1; i< users.length; i++){
                leaf = keccak256(abi.encodePacked(leaf, users[i], amounts[i]));
            }
        }

        return leaf;
    }
}
