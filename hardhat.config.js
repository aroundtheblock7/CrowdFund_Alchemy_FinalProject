require('@nomicfoundation/hardhat-toolbox')
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {
      chainId: 31337,
  },
    localhost: {
      chainId: 31337,
  },
  sepolia: {
    url: process.env.ALCHEMY_SEPOLIA_URL,
    accounts: [process.env.SEPOLIA_PRIVATE_KEY],
  },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
}

