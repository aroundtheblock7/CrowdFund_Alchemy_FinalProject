
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const CrowdCoin = await hre.ethers.getContractFactory("CrowdCoin");
  const crowdcoin = await CrowdCoin.deploy();

  const CrowdFund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdfund = await CrowdFund.deploy(crowdcoin.address);

  console.log("CrowdCoin deployed to: ", crowdcoin.address);
  console.log("CrowdFund deployed to: ", crowdfund.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
