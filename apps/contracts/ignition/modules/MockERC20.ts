import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deploy MockERC20 token for testing on Celo Sepolia.
 * This will be used as the reward token (cUSD substitute).
 */
const MockERC20Module = buildModule("MockERC20Module", (m) => {
  const mockToken = m.contract("MockERC20", ["Mock cUSD", "cUSD"]);

  return { mockToken };
});

export default MockERC20Module;

