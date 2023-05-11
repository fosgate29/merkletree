// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MTbatch is ERC20, Ownable {

    /// @notice Merkle proof of token amounts assigned to different addresses
    bytes32 merkleRoot;
    
    constructor() ERC20("Token", "TKN"){
        _mint(address(this), 10 * 2**8);
    }

    function executeTransfer(bytes32[] calldata _merkleProof, address to, uint256 amount) external payable {
        require(canTransfer(to, amount, _merkleProof), "Invalid leave");
        address from = address(this);
        _transfer(from, to, amount);
    }

    /// @notice Merkle proof of token amounts assigned to different addresses
    function setProof(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function canTransfer(address _user, uint256 amount, bytes32[] calldata _merkleProof)
        internal
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(_user, amount));
        return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
    }

    function abiencoded(address account, uint256 amount) external view virtual returns (bytes memory) {
       return abi.encodePacked(account, amount);
	}

	function getLeaf(address account, uint256 amount) external view virtual returns (bytes32 ) {
       bytes32 leaf = keccak256(abi.encodePacked(account, amount));
       return leaf;
	}
}
