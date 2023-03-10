import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
dotenv.config();

// private environment information
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const POLYGONSCAN = process.env.POLYGONSCAN || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ]
  },
  networks: {
    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts:
        PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    polygonMumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts:
        PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      gas: 2100000,
      gasPrice: 8000000000
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      gas: 2100000,
      gasPrice: 8000000000
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN,
      polygonMumbai: POLYGONSCAN,
    }
}

};

export default config;
