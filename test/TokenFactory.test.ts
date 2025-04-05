import { ethers } from "hardhat";
import { expect } from "chai";
import { Token, TokenFactory } from "../typechain-types";

describe("TokenFactory", function () {
  let tokenFactory: TokenFactory;
  let owner: any, user: any, otherUser: any;

  beforeEach(async function () {
    [owner, user, otherUser] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    tokenFactory = (await TokenFactory.deploy()) as TokenFactory;
    await tokenFactory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct owner", async function () {
      expect(await tokenFactory.owner()).to.equal(owner.address);
    });
  });

  describe("Token Creation", function () {
    const tokenName = "My Token";
    const tokenSymbol = "MTK";
    const tokenSupply = ethers.parseEther("1000000");

    it("Should create token successfully", async function () {
      const tx = await tokenFactory
        .connect(user)
        .createToken(tokenName, tokenSymbol, tokenSupply);

      const deployedTokenAddress = (await tokenFactory.getAllTokens())[0];
      expect(deployedTokenAddress).to.be.properAddress;

      await expect(tx)
        .to.emit(tokenFactory, "TokenCreated")
        .withArgs(deployedTokenAddress, user.address, tokenName, tokenSymbol);

      const deployedToken = (await ethers.getContractAt("Token", deployedTokenAddress)) as Token;

      expect(await deployedToken.name()).to.equal(tokenName);
      expect(await deployedToken.symbol()).to.equal(tokenSymbol);
      expect(await deployedToken.totalSupply()).to.equal(tokenSupply);
      expect(await deployedToken.creator()).to.equal(user.address);
    });

    it("Should correctly track multiple tokens", async function () {
      await tokenFactory.connect(user).createToken("Token1", "TK1", tokenSupply);
      await tokenFactory.connect(otherUser).createToken("Token2", "TK2", tokenSupply);

      const tokens = await tokenFactory.getAllTokens();
      expect(tokens.length).to.equal(2);
    });
  });
});
