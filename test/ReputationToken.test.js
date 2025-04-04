const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReputationToken", function () {
    let ReputationToken;
    let reputationToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy mock VRF Coordinator and Price Feed
        const MockVRFCoordinator = await ethers.getContractFactory("MockVRFCoordinator");
        const mockVRFCoordinator = await MockVRFCoordinator.deploy();
        await mockVRFCoordinator.deployed();

        const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
        const mockPriceFeed = await MockPriceFeed.deploy();
        await mockPriceFeed.deployed();

        ReputationToken = await ethers.getContractFactory("ReputationToken");
        reputationToken = await ReputationToken.deploy(
            mockVRFCoordinator.address,
            ethers.utils.keccak256(ethers.utils.toUtf8Bytes("keyHash")),
            1, // subscriptionId
            100000, // callbackGasLimit
            mockPriceFeed.address
        );
        await reputationToken.deployed();
    });

    describe("Attestation", function () {
        it("Should create a new attestation", async function () {
            const score = 85;
            const metadata = "Test attestation";

            await reputationToken.requestAttestation(addr1.address, score, metadata);
            
            // Wait for VRF callback
            await new Promise(resolve => setTimeout(resolve, 1000));

            const attestation = await reputationToken.getAttestation(1);
            expect(attestation.score).to.equal(score);
            expect(attestation.metadata).to.equal(metadata);
            expect(attestation.issuer).to.equal(owner.address);
            expect(attestation.randomNumber).to.not.equal(0);
            expect(attestation.usdValue).to.not.equal(0);
        });

        it("Should not allow duplicate attestations", async function () {
            const score = 85;
            const metadata = "Test attestation";

            await reputationToken.requestAttestation(addr1.address, score, metadata);
            
            // Wait for VRF callback
            await new Promise(resolve => setTimeout(resolve, 1000));

            await expect(
                reputationToken.requestAttestation(addr1.address, score, metadata)
            ).to.be.revertedWith("Already attested to this user");
        });

        it("Should calculate correct USD value", async function () {
            const score = 50;
            const metadata = "Test attestation";

            await reputationToken.requestAttestation(addr1.address, score, metadata);
            
            // Wait for VRF callback
            await new Promise(resolve => setTimeout(resolve, 1000));

            const attestation = await reputationToken.getAttestation(1);
            const userTotalValue = await reputationToken.getUserTotalValue(addr1.address);
            
            expect(userTotalValue).to.equal(attestation.usdValue);
        });
    });

    describe("Soulbound", function () {
        it("Should not allow token transfers", async function () {
            const score = 85;
            const metadata = "Test attestation";

            await reputationToken.requestAttestation(addr1.address, score, metadata);
            
            // Wait for VRF callback
            await new Promise(resolve => setTimeout(resolve, 1000));

            await expect(
                reputationToken.transferFrom(addr1.address, addr2.address, 1)
            ).to.be.revertedWith("Soulbound token cannot be transferred");
        });
    });
}); 