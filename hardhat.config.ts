import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import dotenv from "dotenv";

dotenv.config();

module.exports = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    horizon: {
      url: "https://rpc1-horizon.bahamut.io",
      accounts: [process.env.PRIVATE_KEY],
    }
  },
};

const config: HardhatUserConfig = {
  solidity: "0.8.28",
};

export default config;
