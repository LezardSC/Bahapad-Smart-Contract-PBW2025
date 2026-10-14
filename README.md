# PBW2025 Token Launchpad Smart Contract

## Bahapad, the Launchpad of Bahamut

🥉 3rd place of the Bahamut track at the Paris Blockchain Week 2025 hackathon.

> [!WARNING]
> **The Bahamut chain is no longer reachable.** As of October 2026, its public RPC endpoints (`rpc1.bahamut.io`, `rpc1-horizon.bahamut.io`, ...) and the ftnscan explorer don't respond anymore, so the deployed contracts below can't be used. The project still runs on a local Hardhat chain, see [Run it locally](#run-it-locally).

## Overview

This hackathon project lets users deploy custom ERC-20 tokens with metadata (name, symbol, total supply, image, description) using a factory pattern. It’s built with Solidity (v0.8.28) and deployed via Hardhat Ignition, supporting both the Bahamut testnet ("horizon") and mainnet.

The frontend lives in its own repository: [bahapad](https://github.com/theocerdan/bahapad).

## Contracts

- **Token Contract:**
	Extends the standard ERC20 to include metadata and automatically mints the total supply to the creator.

- **Token Factory Contract:**
	Deploys new Token contracts and emits a `TokenCreated` event on creation, which the frontend uses to list the tokens.

## Deployments

| Network | Chain ID | TokenFactory |
| --- | --- | --- |
| Bahamut mainnet | 5165 | `0x159a456eeA939Bc80c0aC3861C4C4d800F31bB53` |
| Horizon testnet | 2552 | `0xc0d7a04eC3fBA6Dc6Ea337091278A43C33Cb154c` |

## Run it locally

```bash
npm install
npm test                # run the contract tests
```

To use it with the frontend, start a local chain and keep it running:

```bash
npm run node
```

Then, in another terminal, deploy the factory and create a few demo tokens:

```bash
npm run deploy:local    # deploys TokenFactory at 0x5FbDB2315678afecb367f032d93F642f64180aa3 on a fresh node
npm run seed            # creates demo tokens using the mascots served by the frontend
```

The seed script stores the images as `/mascots/<name>.svg`, relative to the frontend. Set `IMAGE_BASE_URL` to use another location, and `FACTORY_ADDRESS` if the factory isn't the one from `npm run deploy:local`.

`npm run node` prints funded test accounts with their private keys, import one in your wallet to interact with the app.

## Configuration

### Hardhat Configuration (hardhat.config.ts)
- **Solidity Version:** 0.8.28

- **Networks:**

	- **horizon:** Bahamut testnet at `https://rpc1-horizon.bahamut.io`

	- **mainnet:** Bahamut mainnet at `https://rpc1.bahamut.io`

	- **localhost:** Hardhat node started with `npm run node`

- **Typechain:** Set to generate types for Ethers v6.

- **Environment Variables:**
The private key used to deploy on the Bahamut networks is stored in a `.env` file (using `dotenv`). It isn't needed for local development.

## Deployment on Bahamut

1. **Set Up Environment:**
Create a `.env` file in the project root:
```PRIVATE_KEY=your_private_key_here```

2. **Deploy Contracts:**
To deploy on the horizon testnet:

```bash
npx hardhat ignition deploy ignition/modules/TokenModule.ts --network horizon
```

Or on mainnet:
```bash
npx hardhat ignition deploy ignition/modules/TokenModule.ts --network mainnet
```

## Usage
- **Token Creation:**
Interact with the TokenFactory’s `createToken` function by providing the token’s name, symbol, total supply, image URL, and description.
- **Tracking Deployments:**
Each token creation triggers a `TokenCreated` event, allowing you to track new tokens off-chain.
