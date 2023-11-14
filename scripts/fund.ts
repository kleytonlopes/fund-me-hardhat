import { deployments, ethers, network } from "hardhat";
import { FundMe } from "../typechain-types";


async function main(){
    const FUND_ME = "FundMe";
    const sendValue = ethers.parseEther("0.1"); //0.1 ETH
    const fundMeDeployment = await deployments.get(FUND_ME);
    const fundMeContract: FundMe = await ethers.getContractAt(FUND_ME, fundMeDeployment.address);
    console.log("Funding Contract...");
    const transactionResponse = await fundMeContract.fund({value: sendValue});
    await transactionResponse.wait(1);
    console.log("Funded!");
}

main()
    .then(() => process.exit())
    .catch((error: Error)=>{
        console.log(error);
        process.exit();
});

//yarn hardhat node
//yarn hardhat deploy --network localhost
//yarn hardhat run scripts/fund.ts --network localhost


