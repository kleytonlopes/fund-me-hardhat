import { HardhatRuntimeEnvironment } from "hardhat/types";
import {DeployFunction} from "hardhat-deploy/types"
import { network } from "hardhat";
import {networks, developmentChains} from "../helper-hardhat-config";

const deployFundMe: DeployFunction = async function deploy({ getNamedAccounts, deployments } : HardhatRuntimeEnvironment){
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId: number = network.config.chainId ?? -1;
    // const ethUsdPriceFeedAddress = networks[chainId].ethUsdPriceFeedAddress;
    let address;
    log("Deploing the contract...");
    log(`Rede Atual: ${network.name}(${chainId})`);

    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        address = ethUsdAggregator.address;
    }
    else{
        address = networks[chainId].ethUsdPriceFeedAddress;
    }

    // the following will only deploy "GenericMetaTxProcessor" if the contract was never deployed or if the code changed since last deployment
    const fundme = await deploy('FundMe', {
        from: deployer,
        log: true,
        // gasLimit: 4000000,
        args: [address], //put priceFeedAddress
        waitConfirmations: networks[chainId]?.blockConfirmations ?? 1
    });

    log("-------------------------------")
}
// module.exports.default = deploy;
// module.exports.tags = ["all", "fundme"];
//export const tags = ["all", "fundme"];
deployFundMe.tags = ["all", "fundme"]
export default deployFundMe
