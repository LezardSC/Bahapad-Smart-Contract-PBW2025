# PBW2025 Token Launchpad Smart Contract

## Bahapad, the Launchpad of Bahamut

## Overview

This hackathon project lets users deploy custom ERC-20 tokens with metadata (name, symbol, total supply, image, description) using a factory pattern. It’s built with Solidity (v0.8.28) and deployed via Hardhat, supporting both the Bahamut testnet ("horizon") and mainnet.

## Contracts

- **Token Contract:**
	Extends the standard ERC20 to include metadata and automatically mints the total supply to the creator.

- **Token Factory Contract:**
	Deploys new Token contracts, tracks deployed token addresses, and emits events on creation.

## Configuration

### Hardhat Configuration (hardhat.config.ts)
- **Solidity Version:** 0.8.28

- **Networks:**

	- **horizon:** Bahamut testnet at `https://rpc1-horizon.bahamut.io`

	- **mainnet:** Bahamut mainnet at `https://rpc1.bahamut.io`

	- **Typechain:** Set to generate types for Ethers v6.

- **Environment Variables:**
The private key is stored in a `.env` file (using `dotenv`).

## Deployment

1. **Clone and Install Dependencies:**

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

2. **Set Up Environment:**
Create a `.env` file in the project root:
```PRIVATE_KEY=your_private_key_here```

3. **Compile Contracts:**

```bash
npx hardhat compile
```

4. **Deploy Contracts:**
To deploy on the horizon testnet:

```bash
npx hardhat run --network horizon scripts/deploy.js
```

Or on mainnet:
```bash
npx hardhat run --network mainnet scripts/deploy.js
```

## Usage
- **Token Creation:**
Interact with the TokenFactory’s `createToken` function by providing the token’s name, symbol, total supply, image URL, and description.
- **Tracking Deployments:**
Each token creation triggers a `TokenCreated` event, allowing you to track new tokens off-chain.
