# Luckysoul - Web3 Reputation System

A decentralized reputation system built on Base using MiniKit that enables users to create trust circles by issuing non-transferable reputation attestations.

## Features

- Issue Soulbound Tokens (SBTs) as reputation attestations
- Real-time notifications for new attestations
- View your trust network and received attestations
- Non-transferable reputation scores
- Built on Base using MiniKit

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Wagmi/Viem for Web3 interactions
- Redis for real-time notifications
- OpenZeppelin for smart contracts

## Smart Contract

The core of the system is the `ReputationToken` smart contract, which implements:

- ERC721-based Soulbound Tokens
- Non-transferable reputation attestations
- Score-based reputation system (0-100)
- Metadata support for attestation details

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd luckysoul
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Luckysoul
REDIS_URL=your-redis-url
```

4. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network base
```

5. Update the contract address:
After deployment, update the `CONTRACT_ADDRESSES.REPUTATION_TOKEN` in `lib/web3-config.ts` with your deployed contract address.

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Usage

1. Connect your wallet using the Connect button
2. Issue attestations to other users by providing:
   - Recipient address
   - Reputation score (0-100)
   - Metadata describing the attestation
3. View your received attestations and trust network
4. Receive real-time notifications for new attestations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
