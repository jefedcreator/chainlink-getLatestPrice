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
  const USDC_ETH = "0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf"
  const RINKEBY_USDC = "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926";
  const RINKEBY_ETH = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  const RANDADDRESS = ""
  const RANDADDRESS2 = ""

  const chainlink = await ethers.getContractFactory("PriceConsumerV3");
  const getChainlink = await chainlink.deploy(USDC_ETH);

  const showdetails = await getChainlink.deployed();
  const getLatestPrice = await showdetails.getLatestPrice();
  const swapTokens = await showdetails.swapTokens(RINKEBY_ETH, 100,RINKEBY_USDC,RANDADDRESS);
  const swapper = await showdetails.swapper(0,20,RANDADDRESS2,RINKEBY_USDC);
  const buyerBal = await showdetails.buyerBal(RANDADDRESS2);

  console.log(getLatestPrice);
  console.log(swapTokens);
  console.log(swapper);
  console.log(buyerBal);
  
  
  


  console.log("Greeter deployed to:", getChainlink.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
