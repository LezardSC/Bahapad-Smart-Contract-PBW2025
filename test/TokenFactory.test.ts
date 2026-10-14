import { ethers } from "hardhat";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { Token, TokenFactory } from "../typechain-types";

describe("TokenFactory", function () {
  let tokenFactory: TokenFactory;
  let user: any, otherUser: any;

  const tokenName = "My Token";
  const tokenSymbol = "MTK";
  const tokenSupply = ethers.parseEther("1000000");
  const tokenImage = "https://example.com/token.png";
  const tokenDescription = "My dream token";

  beforeEach(async function () {
    [, user, otherUser] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    tokenFactory = (await TokenFactory.deploy()) as TokenFactory;
    await tokenFactory.waitForDeployment();
  });

  const createdTokenAddresses = async () => {
    const events = await tokenFactory.queryFilter(tokenFactory.filters.TokenCreated());
    return events.map((e) => e.args.tokenAddress);
  };

  describe("Token Creation", function () {
    it("Should create token successfully", async function () {
      const tx = await tokenFactory
        .connect(user)
        .createToken(tokenName, tokenSymbol, tokenSupply, tokenImage, tokenDescription);

      const [deployedTokenAddress] = await createdTokenAddresses();
      expect(deployedTokenAddress).to.be.properAddress;

      await expect(tx)
        .to.emit(tokenFactory, "TokenCreated")
        .withArgs(
          deployedTokenAddress,
          user.address,
          tokenName,
          tokenSymbol,
          tokenSupply,
          tokenImage,
          tokenDescription,
          anyValue,
        );

      const deployedToken = (await ethers.getContractAt("Token", deployedTokenAddress)) as Token;

      expect(await deployedToken.name()).to.equal(tokenName);
      expect(await deployedToken.symbol()).to.equal(tokenSymbol);
      expect(await deployedToken.totalSupply()).to.equal(tokenSupply);
      expect(await deployedToken.creator()).to.equal(user.address);
      expect(await deployedToken.image()).to.equal(tokenImage);
      expect(await deployedToken.description()).to.equal(tokenDescription);
    });

    it("Should mint the whole supply to the creator", async function () {
      await tokenFactory
        .connect(user)
        .createToken(tokenName, tokenSymbol, tokenSupply, tokenImage, tokenDescription);

      const [deployedTokenAddress] = await createdTokenAddresses();
      const deployedToken = (await ethers.getContractAt("Token", deployedTokenAddress)) as Token;

      expect(await deployedToken.balanceOf(user.address)).to.equal(tokenSupply);
    });

    it("Should emit one event per created token", async function () {
      await tokenFactory.connect(user).createToken("Token1", "TK1", tokenSupply, tokenImage, tokenDescription);
      await tokenFactory.connect(otherUser).createToken("Token2", "TK2", tokenSupply, tokenImage, tokenDescription);

      const tokens = await createdTokenAddresses();
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.not.equal(tokens[1]);
    });
  });
});
