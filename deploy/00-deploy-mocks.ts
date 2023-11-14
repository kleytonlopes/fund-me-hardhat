import { HardhatRuntimeEnvironment } from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types"
import { network } from "hardhat";
import { DECIMALS, 
         INITIAL_ANSWER } from "../helper-hardhat-config"; 

const deployMocks: DeployFunction = async function deploy({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment){
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    // if(developmentChains.includes(network.name)){
    if(network.config.chainId == 31337){
        log("Local network detected! Deploying mocks..");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("------------------------------------------")
    }
}

// module.exports.tags = ["all", "mocks"];
deployMocks.tags = ["all", "mocks"]
export default deployMocks
