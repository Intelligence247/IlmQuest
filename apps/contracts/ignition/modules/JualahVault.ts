import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Ignition module for deploying JualahVault.
 *
 * Parameters:
 * - adminSigner: address of the backend oracle signer (defaults to deployer)
 * - rewardToken: address of the ERC20 reward token (REQUIRED on live networks)
 * - owner: owner of the vault (defaults to deployer)
 */
const JualahVaultModule = buildModule("JualahVaultModule", (m) => {
  const deployer = m.getAccount(0);

  const adminSigner = m.getParameter("adminSigner", deployer);
  const owner = m.getParameter("owner", deployer);

  // IMPORTANT: for live networks you must override this with the actual cUSD address
  const rewardToken = m.getParameter("rewardToken");

  const vault = m.contract("JualahVault", [adminSigner, rewardToken, owner]);

  return { vault };
});

export default JualahVaultModule;


