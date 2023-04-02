require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '../../.env' });

require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

// const defaultNetwork = 'localhost'; // to run test the frontend on a local chain
const defaultNetwork = 'hardhat'; // to run the tests

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.10',

  defaultNetwork,

  networks: {
    localhost: {
      chainId: 31337,
    },

    alfajores: {
      chainId: 44787,
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    tokenOwner: 1,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      alfajores: process.env.CELOSCAN_API_KEY,
    },
    customChains: [
    {
      network: "alfajores",
      chainId: 44787,
      urls: {
        apiURL: "https://api-alfajores.celoscan.io/api",
        browserURL: "https://alfajores.celoscan.io"
      }
    }
  ]
  },
};