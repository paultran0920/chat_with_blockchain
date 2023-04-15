const BlockchainChat = artifacts.require("BlockchainChat");

module.exports = function(deployer) {
  deployer.deploy(BlockchainChat);
};
