// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts directly
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/utils/math/Counters.sol";

contract ReputationToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Attestation {
        address issuer;
        uint256 score;
        string metadata;
        uint256 timestamp;
    }

    mapping(uint256 => Attestation) public attestations;
    mapping(address => uint256[]) public userAttestations;
    mapping(address => mapping(address => bool)) public hasAttested;

    event AttestationIssued(
        address indexed issuer,
        address indexed recipient,
        uint256 tokenId,
        uint256 score
    );

    constructor() ERC721("Trust Circle Reputation", "TCR") Ownable(msg.sender) {}

    function issueAttestation(
        address recipient,
        uint256 score,
        string memory metadata
    ) public returns (uint256) {
        require(score >= 0 && score <= 100, "Score must be between 0 and 100");
        require(!hasAttested[msg.sender][recipient], "Already attested to this user");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(recipient, newTokenId);
        
        attestations[newTokenId] = Attestation({
            issuer: msg.sender,
            score: score,
            metadata: metadata,
            timestamp: block.timestamp
        });
        
        userAttestations[recipient].push(newTokenId);
        hasAttested[msg.sender][recipient] = true;
        
        emit AttestationIssued(msg.sender, recipient, newTokenId, score);
        
        return newTokenId;
    }

    function getAttestation(uint256 tokenId) public view returns (Attestation memory) {
        require(_exists(tokenId), "Token does not exist");
        return attestations[tokenId];
    }

    function getUserAttestations(address user) public view returns (uint256[] memory) {
        return userAttestations[user];
    }

    // Override transfer functions to make token soulbound
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soulbound token cannot be transferred");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("Soulbound token cannot be transferred");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("Soulbound token cannot be transferred");
    }
} 