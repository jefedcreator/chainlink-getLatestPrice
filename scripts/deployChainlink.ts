// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { hrtime } from "process";

const INCH_USD = "0xc929ad75B72593967DE83E7F7Cda0493458261D9";
const MAINNET_USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const RANDADDRESS = "0x31fb770eeda360fa770203493824140d8dc74c03";
const INCH = "0x111111111117dC0aa78b770fA6A738034120C302";
const INCHOWNER = "0xa64b2ba0934b5eb3ff2e21dcb3b8e93b5700cbd3";
const swapUsdc = "0xbb98f2a83d78310342da3e63278ce7515d52619d";
const swapInch = "0x4240781a9ebdb2eb14a183466e8820978b7da4e2";


async function main() { 
  const chainlink = await ethers.getContractFactory("PriceConsumerV3");
  const getChainlink:any = await chainlink.deploy(INCH_USD);
  
  const showdetails = await getChainlink.deployed();

  
  //Persons USDT balance before swap
  const randSigner: Signer = await ethers.getSigner(RANDADDRESS)
  const usdcInteract = await ethers.getContractAt("iERC20",MAINNET_USDC);
  const viewBalance = await usdcInteract.balanceOf(RANDADDRESS);
  console.log("Person's balance before swap",viewBalance);
  
  //Impersonate account with USDC
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [RANDADDRESS],
  })

  // //@ts-ignore
  await usdcInteract.connect(randSigner).transfer(
    showdetails.address,
    "10000"
  )
  
  console.log("show contract Usdt bal:",await usdcInteract.balanceOf(showdetails.address));
  console.log("Person's balance after swap",viewBalance);
    
  const inchSigner: Signer = await ethers.getSigner(INCHOWNER)
  const InchInteract = await ethers.getContractAt("iERC20",INCH);
  const viewInchBalance = await InchInteract.balanceOf(INCHOWNER);
  console.log("Person's inch balance before swap",viewInchBalance);
  
  //Impersonate account with INCH
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [INCHOWNER],
  })
  // We get the contract to deploy
  // await InchInteract.connect(inchSigner).approve(showdetails.address, "1000000000")
  await InchInteract.connect(inchSigner).transfer(
    showdetails.address,
    "100000"
  )
  
  console.log("show contract Inch bal:",await InchInteract.balanceOf(showdetails.address));
  console.log("Person's Inch balance after swap",viewInchBalance);

  //Impersonate account to swap USDforInch
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [swapUsdc],
  })

  const swapSigner:Signer = await ethers.getSigner(swapUsdc)
  
  await usdcInteract.connect(swapSigner).approve(
    showdetails.address,
    "10000000000000000000"
  )

  console.log("contract allowance:",await usdcInteract.allowance(swapUsdc,showdetails.address));
  

  console.log('person about to swap');

  await showdetails.connect(swapSigner).swapUSDCforINCH(200);
  console.log(await showdetails.viewRate());
  console.log(await showdetails.viewOrder());
  
  console.log('person swapping, soon');

  console.log("Inch balance of Swapper contract:", await InchInteract.balanceOf(showdetails.address));
  console.log("Usdt balance of Swapper contract:", await usdcInteract.balanceOf(showdetails.address));
  
  console.log("Usdc owner inch balance",await InchInteract.balanceOf(swapUsdc))

  //Impersonate Inch holder to swap for usdc
  //@ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [swapInch],
  })
  
  const swapSigner2:Signer =await ethers.getSigner(swapInch);

  await InchInteract.connect(swapSigner2).approve(
    showdetails.address,
    "10000000000000000000"
  )

  console.log('person about to swap');
  await showdetails.connect(swapSigner2).swapINCHforUSDC(200);
  console.log("Inch balance of Swapper contract:", await InchInteract.balanceOf(showdetails.address));
  console.log("Usdt balance of Swapper contract:", await usdcInteract.balanceOf(showdetails.address));
  
  console.log("Swap Complete ");
  
  console.log("Inch owner usdc balance",await usdcInteract.balanceOf(swapInch))
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
