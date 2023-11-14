import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import '@typechain/hardhat'
import '@nomicfoundation/hardhat-chai-matchers'
import dotenv from 'dotenv'; 
dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";
const CHAIN_ID = 11155111;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
// const ETHERSCAM_API_KEY = process.env.ETHERSCAM_API_KEY;

const config: HardhatUserConfig = {
  // solidity: "0.8.19",
  solidity: {
    compilers: [
      {version: "0.8.19"},
      {version: "0.8.0"}
    ]
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: CHAIN_ID
    }
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC"

  },
  etherscan: {
    apiKey: process.env.ETHERSCAM_API_KEY,
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
},
};
export default config;
