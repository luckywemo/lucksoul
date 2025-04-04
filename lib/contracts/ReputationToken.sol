// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts directly
import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/utils/math/Counters.sol";
import "./@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "./@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ReputationToken is ERC721, Ownable, VRFConsumerBaseV2 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    bytes32 private immutable keyHash;
    uint64 private immutable subscriptionId;
    uint32 private immutable callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Chainlink Price Feed Variables
    AggregatorV3Interface private immutable priceFeed;
    uint256 private constant DECIMALS = 18;
    uint256 private constant PRICE_FEED_DECIMALS = 8;

    // Mapping to store pending attestations
    mapping(uint256 => address) public pendingAttestations;
    mapping(uint256 => uint256) public pendingScores;
    mapping(uint256 => string) public pendingMetadata;

    struct Attestation {
        address issuer;
        uint256 score;
        string metadata;
        uint256 timestamp;
        uint256 randomNumber;
        uint256 usdValue; // Added USD value of the attestation
    }

    mapping(uint256 => Attestation) public attestations;
    mapping(address => uint256[]) public userAttestations;
    mapping(address => mapping(address => bool)) public hasAttested;
    mapping(address => uint256) public userTotalValue; // Total USD value of user's attestations

    event AttestationIssued(
        address indexed issuer,
        address indexed recipient,
        uint256 tokenId,
        uint256 score,
        uint256 randomNumber,
        uint256 usdValue
    );
    event RandomnessRequested(uint256 requestId, address indexed issuer, address indexed recipient);
    event PriceFeedUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        address _priceFeed
    ) 
        ERC721("Trust Circle Reputation", "TCR") 
        Ownable(msg.sender)
        VRFConsumerBaseV2(_vrfCoordinator)
    {
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function requestAttestation(
        address recipient,
        uint256 score,
        string memory metadata
    ) public returns (uint256) {
        require(score >= 0 && score <= 100, "Score must be between 0 and 100");
        require(!hasAttested[msg.sender][recipient], "Already attested to this user");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Store pending attestation data
        pendingAttestations[newTokenId] = recipient;
        pendingScores[newTokenId] = score;
        pendingMetadata[newTokenId] = metadata;
        
        // Request random number from Chainlink VRF
        uint256 requestId = vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            callbackGasLimit,
            NUM_WORDS
        );
        
        emit RandomnessRequested(requestId, msg.sender, recipient);
        return newTokenId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 tokenId = requestId;
        address recipient = pendingAttestations[tokenId];
        uint256 score = pendingScores[tokenId];
        string memory metadata = pendingMetadata[tokenId];
        
        // Get current ETH price from Chainlink
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 usdValue = calculateUSDValue(score, uint256(price));
        
        // Clear pending data
        delete pendingAttestations[tokenId];
        delete pendingScores[tokenId];
        delete pendingMetadata[tokenId];
        
        // Mint the token
        _safeMint(recipient, tokenId);
        
        // Store attestation with random number and USD value
        attestations[tokenId] = Attestation({
            issuer: msg.sender,
            score: score,
            metadata: metadata,
            timestamp: block.timestamp,
            randomNumber: randomWords[0],
            usdValue: usdValue
        });
        
        userAttestations[recipient].push(tokenId);
        userTotalValue[recipient] += usdValue;
        hasAttested[msg.sender][recipient] = true;
        
        emit AttestationIssued(msg.sender, recipient, tokenId, score, randomWords[0], usdValue);
    }

    function calculateUSDValue(uint256 score, uint256 ethPrice) internal pure returns (uint256) {
        // Convert ETH price to 18 decimals
        uint256 normalizedPrice = ethPrice * (10 ** (DECIMALS - PRICE_FEED_DECIMALS));
        // Calculate value based on score (1 ETH per 100 points)
        return (normalizedPrice * score) / 100;
    }

    function getAttestation(uint256 tokenId) public view returns (Attestation memory) {
        require(_exists(tokenId), "Token does not exist");
        return attestations[tokenId];
    }

    function getUserAttestations(address user) public view returns (uint256[] memory) {
        return userAttestations[user];
    }

    function getUserTotalValue(address user) public view returns (uint256) {
        return userTotalValue[user];
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