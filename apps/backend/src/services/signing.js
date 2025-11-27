const { ethers } = require("ethers");
const env = require("../config/env");

// Create wallet from admin private key
const wallet = new ethers.Wallet(env.ADMIN_PRIVATE_KEY);

/**
 * Get the admin signer address
 */
function getAdminAddress() {
  return wallet.address;
}

/**
 * Generate a random bytes32 nonce
 */
function generateNonce() {
  return ethers.hexlify(ethers.randomBytes(32));
}

/**
 * Sign a reward authorization that matches JualahVault.claimReward
 *
 * The contract expects:
 * messageHash = keccak256(abi.encodePacked(
 *   address(this),   // vault contract address
 *   block.chainid,   // chain id
 *   userAddress,     // the claimer
 *   levelId,         // string
 *   rewardAmount,    // uint256
 *   nonce            // bytes32
 * ))
 *
 * Then wrapped with toEthSignedMessageHash() for ECDSA.recover
 */
async function signRewardAuthorization({
  vaultAddress,
  chainId,
  userAddress,
  levelId,
  rewardAmountWei,
  nonce,
}) {
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256", "address", "string", "uint256", "bytes32"],
    [vaultAddress, chainId, userAddress, levelId, rewardAmountWei, nonce]
  );

  // signMessage automatically prefixes with "\x19Ethereum Signed Message:\n32"
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));
  return signature;
}

module.exports = {
  getAdminAddress,
  generateNonce,
  signRewardAuthorization,
};

