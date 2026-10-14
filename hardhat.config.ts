import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import dotenv from "dotenv";

dotenv.config();

// Only required to deploy on the Bahamut networks, local commands work without it.
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    horizon: {
      url: "https://rpc1-horizon.bahamut.io",
      accounts,
    },
    mainnet: {
      url: "https://rpc1.bahamut.io",
      accounts,
    },
  },
};

export default config;
