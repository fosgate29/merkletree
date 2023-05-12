// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MTbatch is ERC20, Ownable {

    bytes32 public root;

    constructor() ERC20("Token", "TKN"){
        _mint(address(this), 10 * 2**8);
    }

    function executeTransfer(bytes32[] calldata proof,  address[] calldata users, uint256[] calldata amounts) external  {
        
        require(users.length > 0, "Size cant be zero");
        require(users.length == amounts.length, "Different array size");

        bytes32 leaf = getLeaf(users, amounts);
        leaf = keccak256(bytes.concat(keccak256(abi.encode(leaf))));

        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");

        address from = address(this);

        for(uint256 i=0; i<users.length ; i++){
            _transfer(from, users[i], amounts[i]);
        }
    }

    /// @notice Merkle proof of token amounts assigned to different addresses
    function setRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }

    function getLeaf(address[] calldata users, uint256[] calldata amounts) pure public returns (bytes32)
    {
        bytes32 leaf = keccak256(abi.encodePacked(users[0], amounts[0]));

        if(users.length > 1){
            for(uint256 i=1; i< users.length; i++){
                leaf = keccak256(abi.encodePacked(leaf, users[i], amounts[i]));
            }
        }

        return leaf;
    }
}
