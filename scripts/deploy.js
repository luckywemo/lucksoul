const hre = require("hardhat");

async function main() {
    // Chainlink VRF Coordinator addresses for different networks
    const VRF_COORDINATOR = {
        sepolia: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        base: "0x...", // Add Base network VRF Coordinator address
    };

    // Gas lane key hash for different networks
    const KEY_HASH = {
        sepolia: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        base: "0x...", // Add Base network key hash
    };

    // Chainlink Price Feed addresses for different networks
    const PRICE_FEED = {
        sepolia: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD
        base: "0x...", // Add Base network price feed address
    };

    const network = hre.network.name;
    console.log(`Deploying to ${network} network...`);

    const ReputationToken = await hre.ethers.getContractFactory("ReputationToken");
    
    // Deploy with Chainlink parameters
    const reputationToken = await ReputationToken.deploy(
        VRF_COORDINATOR[network],
        KEY_HASH[network],
        123, // Replace with your subscription ID
        100000, // Callback gas limit
        PRICE_FEED[network]
    );

    await reputationToken.deployed();

    console.log(`ReputationToken deployed to: ${reputationToken.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 