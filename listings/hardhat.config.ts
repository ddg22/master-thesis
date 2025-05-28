import { HardhatUserConfig } from "hardhat/config";
// Import the hardhat-toolbox which bundles several useful plugins
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // Solidity compiler configuration
  solidity: {
    version: "0.8.28", // Specify the Solidity compiler version
    settings: {
      optimizer: {
        enabled: true, // Enable the optimizer to reduce gas costs
        runs: 1000,    // Higher values optimize for when the code is executed many 
					   // times
      },
      evmVersion: "cancun" // Use the latest EVM version for compatibility
						   // with newest features
    },
  },
  
  // Network configurations for deployment and testing
  networks: {
    hardhat: {
      hardfork: "cancun",  // Use the Cancun EVM rules for the in-memory Hardhat 
	                       // Network
      accounts: [
        {
          balance: "10000000000000000000000000000000", // 10^34 wei (extremely large 
													   // balance for testing)
          privateKey: 
		  "0x0000000000000000000000000000000000000000000000000000000000000001"
		  // Deterministic test account
        }
      ]
    },
    localhost: {
      url: "http://127.0.0.1:8545" // Connect to a locally running Ethereum node
    },
  },
  
  // Project structure paths
  paths: {
    sources: "./contracts",   // Directory for smart contract source files
    tests: "./test",          // Directory for test files
    cache: "./cache",         // Directory for the cache
    artifacts: "./artifacts"  // Directory for compiled contract artifacts
  }
};

export default config;
