import { assert, expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { Address } from "hardhat-deploy/types"
import { FundMe, MockV3Aggregator } from "../../typechain-types"
import { developmentChains } from "../../helper-hardhat-config";


//https://github.com/smartcontractkit/full-blockchain-solidity-course-js/discussions/1503
//https://github.com/PatrickAlphaC/hardhat-smartcontract-lottery-fcc/tree/typescript

!developmentChains.includes(network.name) ? describe.skip :
describe("FundMe", async function () {
    const FUND_ME = "FundMe";
    const MOCK_V3_AGGREGATOR = "MockV3Aggregator";
    const sendValue = ethers.parseEther("1.0") //1 ETH
    let fundMeContract: FundMe;
    let mockV3AggregatorContract: MockV3Aggregator;
    let deployerAddress: Address;

    beforeEach(async function() {
        await deployments.fixture(["all"]);
        deployerAddress = (await ethers.provider.getSigner()).address;
        const fundMeDeployment = await deployments.get(FUND_ME);
        const mockDeployment = await deployments.get(MOCK_V3_AGGREGATOR);
        fundMeContract = await ethers.getContractAt(FUND_ME, fundMeDeployment.address);
        mockV3AggregatorContract = await ethers.getContractAt(MOCK_V3_AGGREGATOR, mockDeployment.address);
    });

    describe("constructor", async function(){
        it("Sets the aggregator addredded correctly", async function() {
            const prieceFeedAddress = await fundMeContract.getPriceFeed();
            assert.equal(prieceFeedAddress,  await mockV3AggregatorContract.getAddress());
        })
    })

    describe("fund", async function(){
        it("Fails if you don't send enough ETH", async function() {
            await expect(fundMeContract.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        }),
        it("Updated the amount funded data structure", async function() {
            await fundMeContract.fund({value: sendValue});
            const response = await fundMeContract.getAddressToAmountFunded(
                deployerAddress
            );
            assert.equal(response.toString(), sendValue.toString());
        }),
        it("Adds funder to array of funders", async function() {
            await fundMeContract.fund({value: sendValue});
            const funderAddress = await fundMeContract.getFunder(0);
            assert.equal(funderAddress, deployerAddress)
        })

    }),
    describe("withdraw", async function() {
        beforeEach(async function() {
            await fundMeContract.fund({value: sendValue});
        })

        it("Withdraw ETH from a single founder", async function(){
            //arrange
            const startingFundMeBalance  = await ethers.provider.getBalance(
                fundMeContract.getAddress()
            )
            const startingDeployerBalance  = await ethers.provider.getBalance(
                deployerAddress
            );
            //act
            const transactionResponse = await fundMeContract.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);

            const endingFundingBalance = await ethers.provider.getBalance(
                fundMeContract.getAddress()
            );
            const endingDeployerBalance  = await ethers.provider.getBalance(
                deployerAddress
            );
            //gasCost
            const { gasUsed, gasPrice } = transactionReceipt ?? {gasPrice: 0n, gasUsed: 0n};
            const gasCost: bigint = gasUsed * gasPrice;

            //assert
            assert.equal(endingFundingBalance, 0n);
            assert.equal(
                (startingDeployerBalance + startingFundMeBalance).toString(), 
                (endingDeployerBalance + gasCost).toString()
            );
        })
        it("Withdraw ETH from multiple founders", async function(){
            //arrange
            const accounts = await ethers.getSigners();
            for (let i = 1; i < 6; i++){
                const fundMeConnectedContract = await fundMeContract.connect(accounts[i]);
                await fundMeConnectedContract.fund({value: sendValue});
            }
            const startingFundMeBalance  = await ethers.provider.getBalance(
                fundMeContract.getAddress()
            )
            const startingDeployerBalance  = await ethers.provider.getBalance(
                deployerAddress
            );

            //Act
            const transactionResponse = await fundMeContract.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const endingFundingBalance = await ethers.provider.getBalance(
                fundMeContract.getAddress()
            );
            const endingDeployerBalance  = await ethers.provider.getBalance(
                deployerAddress
            );
            //gasCost
            const { gasUsed, gasPrice } = transactionReceipt ?? {gasPrice: 0n, gasUsed: 0n};
            const gasCost: bigint = gasUsed * gasPrice;

            //assert
            assert.equal(endingFundingBalance, 0n);
            assert.equal(
                (startingDeployerBalance + startingFundMeBalance).toString(), 
                (endingDeployerBalance + gasCost).toString()
            );

            //make sure funders are reset properly
            await expect(fundMeContract.getFunder(0)).to.be.reverted;
            for (let i =1; i < 6; i++){
                assert.equal(await fundMeContract.getAddressToAmountFunded(accounts[i].address), 0n)
            }
        })

        it("Only allows the owner to withdraw", async function(){
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = fundMeContract.connect(attacker);
            await expect(attackerConnectedContract.withdraw())
                    .to
                    .be
                    .revertedWithCustomError(attackerConnectedContract,"FundMe__NotOwner");
        });
    })
})