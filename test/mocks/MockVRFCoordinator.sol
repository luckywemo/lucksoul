// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockVRFCoordinator {
    mapping(uint256 => address) public consumers;
    uint256 public requestId;

    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256) {
        requestId++;
        consumers[requestId] = msg.sender;
        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory randomWords) external {
        address consumer = consumers[_requestId];
        require(consumer != address(0), "Invalid request ID");
        
        // Call the consumer's fulfillRandomWords function
        (bool success, ) = consumer.call(
            abi.encodeWithSignature("rawFulfillRandomWords(uint256,uint256[])", _requestId, randomWords)
        );
        require(success, "Fulfillment failed");
    }
} 