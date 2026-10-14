import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

// Mascot images are served by the frontend (bahapad/public/mascots), the relative path works whatever port it runs on
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL ?? "/mascots";

const TOKENS = [
  {
    name: "Turbo Snail",
    symbol: "TURBO",
    supply: 420_000_000n,
    image: "turbo-snail.svg",
    description: "The fastest snail on Bahamut. Slow and steady pumps the bag.",
  },
  {
    name: "Blub Fish",
    symbol: "BLUB",
    supply: 1_000_000_000n,
    image: "blub-fish.svg",
    description: "Blub blub. Nobody knows what it means, but it's provocative.",
  },
  {
    name: "Gecko Gains",
    symbol: "GECKO",
    supply: 69_000_000n,
    image: "gecko-gains.svg",
    description: "Sticks to the chart like a gecko to a wall. Only goes up.",
  },
  {
    name: "Cosmic Duck",
    symbol: "QUACK",
    supply: 777_777_777n,
    image: "cosmic-duck.svg",
    description: "One small quack for a duck, one giant leap for degens.",
  },
];

const getFactoryAddress = () => {
  if (process.env.FACTORY_ADDRESS) return process.env.FACTORY_ADDRESS;

  const deployedAddressesPath = path.join(
    __dirname,
    "..",
    "ignition",
    "deployments",
    `chain-${network.config.chainId ?? 31337}`,
    "deployed_addresses.json",
  );
  if (!fs.existsSync(deployedAddressesPath)) {
    throw new Error("TokenFactory not deployed on this network, run `npm run deploy:local` first.");
  }
  return JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"))["TokenModule#TokenFactory"];
};

async function main() {
  const factory = await ethers.getContractAt("TokenFactory", getFactoryAddress());
  const signers = await ethers.getSigners();

  for (const [i, token] of TOKENS.entries()) {
    // Spread the tokens over a few creators to make the leaderboard look alive
    const creator = signers[(i % (signers.length - 1)) + 1];
    const tx = await factory
      .connect(creator)
      .createToken(token.name, token.symbol, token.supply, `${IMAGE_BASE_URL}/${token.image}`, token.description);
    await tx.wait();
    console.log(`Created $${token.symbol} from ${creator.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
