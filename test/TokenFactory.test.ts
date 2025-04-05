import { ethers } from "hardhat";
import { expect } from "chai";
import { Token, TokenFactory } from "../typechain-types";

describe("TokenFactory", function () {
  let tokenFactory: TokenFactory;
  let owner: any, user: any, otherUser: any;
  const creationFee = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, user, otherUser] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    tokenFactory = (await TokenFactory.deploy(creationFee)) as TokenFactory;
    await tokenFactory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct owner and creation fee", async function () {
      expect(await tokenFactory.owner()).to.equal(owner.address);
      expect(await tokenFactory.creationFee()).to.equal(creationFee);
    });
  });

  describe("Token Creation", function () {
    const tokenName = "My Token";
    const tokenSymbol = "MTK";
    const tokenSupply = ethers.parseEther("1000000");

    it("Should revert if creation fee is not paid", async function () {
      await expect(
        tokenFactory.connect(user).createToken(tokenName, tokenSymbol, tokenSupply)
      ).to.be.revertedWith("Factory: Fee not paid");
    });

	it("Should create token successfully", async function () {
		const tx = await tokenFactory
		  .connect(user)
		  .createToken(tokenName, tokenSymbol, tokenSupply, { value: creationFee });
	  
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
      await tokenFactory.connect(user).createToken("Token1", "TK1", tokenSupply, { value: creationFee });
      await tokenFactory.connect(otherUser).createToken("Token2", "TK2", tokenSupply, { value: creationFee });

      const tokens = await tokenFactory.getAllTokens();
      expect(tokens.length).to.equal(2);
    });
  });

  describe("Fee Management", function () {
    const tokenSupply = ethers.parseEther("1000000");

    beforeEach(async function () {
      await tokenFactory.connect(user).createToken("TokenFee", "FEE", tokenSupply, { value: creationFee });
    });

    it("Should accumulate creation fees correctly", async function () {
      const factoryBalance = await ethers.provider.getBalance(tokenFactory.target);
      expect(factoryBalance).to.equal(creationFee);
    });

    it("Owner should withdraw accumulated fees", async function () {
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

      const tx = await tokenFactory.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance + creationFee - gasUsed);

      const factoryBalanceAfter = await ethers.provider.getBalance(tokenFactory.target);
      expect(factoryBalanceAfter).to.equal(0);
    });

    it("Non-owner shouldn't be allowed to withdraw fees", async function () {
      await expect(tokenFactory.connect(user).withdrawFees()).to.be.revertedWith("Not owner");
    });
  });
});
