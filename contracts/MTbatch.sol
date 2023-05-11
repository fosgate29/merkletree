// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MTbatch is ERC20, Ownable {

    /// @notice Merkle proof of token amounts assigned to different addresses
    bytes32 root;
    
    constructor() ERC20("Token", "TKN"){
        _mint(address(this), 10 * 2**8);
    }

    function executeTransfer(bytes32[] calldata _merkleProof,  address[] calldata _users, uint256[] calldata _amounts) external  {
        
        require(_users.length > 0, "Size cant be zero");
        require(_users.length == _amounts.length, "Different array size");

        bytes32 finalHash = hashArray(_users, _amounts);

        require(canTransfer(finalHash, _merkleProof), "Invalid leave");

        address from = address(this);

        for(uint256 i=0; i<_users.length ; i++){
            _transfer(from, _users[i], _amounts[i]);
        }
    }

    /// @notice Merkle proof of token amounts assigned to different addresses
    function setProof(bytes32 _root) external onlyOwner {
        root = _root;
    }

    function canTransfer(bytes32 finalHash, bytes32[] calldata _merkleProof)
        internal
        view
        returns (bool)
    {
        return MerkleProof.verify(_merkleProof, root, finalHash);
    }

    function hashArray(address[] calldata _users, uint256[] calldata _amounts)
        public
        pure
        returns (bytes32 finalHash)
    {


        finalHash = keccak256(abi.encodePacked(_users[0], _amounts[0]));

        if(_users.length > 1){
            for(uint256 i=1; i< _users.length; i++){
                finalHash = keccak256(abi.encodePacked(finalHash, _users[i], _amounts[i]));
            }
        }
    }

    function abiencoded(address[] calldata accounts, uint256[] calldata amounts) external view virtual returns (bytes memory) {
       return abi.encodePacked(accounts, amounts);
	}

	function getLeaf(address account, uint256 amount) external view virtual returns (bytes32 ) {
       bytes32 leaf = keccak256(abi.encodePacked(account, amount));
       return leaf;
	}
}
