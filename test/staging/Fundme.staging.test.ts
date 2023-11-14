import { assert, expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { Address } from "hardhat-deploy/types";
import { FundMe } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";


developmentChains.includes(network.name) ? describe.skip :
describe("FundMe", async function(){
    const FUND_ME = "FundMe";
    let fundMeContract : FundMe;
    let deployerAddress: Address;
    const sendValue = ethers.parseEther("0.1"); //0.1 ETH
    beforeEach(async function(){
        deployerAddress = (await ethers.provider.getSigner()).address;
        const fundMeDeployment = await deployments.get(FUND_ME);
        fundMeContract = await ethers.getContractAt(FUND_ME, fundMeDeployment.address);
    });

    it("allows peolple to fund and withdraw", async function(){
        await fundMeContract.fund({value: sendValue});
        await fundMeContract.withdraw()
        const endingBalance = await ethers.provider.getBalance(
            fundMeContract.getAddress()
        );
        assert.equal(endingBalance.toString(), "0")
    })
});
//yarn hardhat deploy --network  
