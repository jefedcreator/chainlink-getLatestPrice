// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const BTC_ETH = "0x2431452A0010a43878bF198e170F6319Af6d27F4"



  const chainlink = await ethers.getContractFactory("PriceConsumerV3");
  const getChainlink = await chainlink.deploy(BTC_ETH);

  const showdetails = await getChainlink.deployed();
  console.log(await showdetails.getLatestPrice());


  console.log("Greeter deployed to:", getChainlink.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
