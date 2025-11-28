const { ethers } = require("ethers");
const env = require("../config/env");

/**
 * Middleware to verify admin wallet authentication
 * 
 * Expects request header:
 *   x-admin-address: 0x...
 *   x-admin-signature: 0x... (signature of a message)
 *   x-admin-message: "Admin authentication for IlmQuest" (or custom message)
 * 
 * The signature must be from a wallet in ADMIN_WALLETS
 */
async function verifyAdminAuth(req, res, next) {
  try {
    const adminAddress = req.headers["x-admin-address"];
    const signature = req.headers["x-admin-signature"];
    const message = req.headers["x-admin-message"] || "Admin authentication for IlmQuest";

    // Check if admin wallets are configured
    if (env.ADMIN_WALLETS.length === 0) {
      console.warn("No admin wallets configured. Admin routes are disabled.");
      return res.status(503).json({
        error: "ADMIN_NOT_CONFIGURED",
        message: "Admin functionality is not configured. Please set ADMIN_WALLETS in environment variables.",
      });
    }

    // Validate required headers
    if (!adminAddress || !signature) {
      return res.status(401).json({
        error: "MISSING_AUTH_HEADERS",
        message: "Missing admin authentication headers. Required: x-admin-address, x-admin-signature",
      });
    }

    // Validate address format
    if (!/^0x[0-9a-fA-F]{40}$/i.test(adminAddress)) {
      return res.status(400).json({
        error: "INVALID_ADDRESS",
        message: "Invalid wallet address format",
      });
    }

    // Check if address is in admin whitelist
    const normalizedAddress = adminAddress.toLowerCase();
    if (!env.ADMIN_WALLETS.includes(normalizedAddress)) {
      return res.status(403).json({
        error: "UNAUTHORIZED",
        message: "This wallet is not authorized as an admin",
      });
    }

    // Verify signature
    try {
      // Recover the signer from the signature
      // ethers.hashMessage automatically prefixes with "\x19Ethereum Signed Message:\n{length}"
      const messageHash = ethers.hashMessage(message);
      const recoveredAddress = ethers.recoverAddress(messageHash, signature);
      
      // Check if recovered address matches the provided address
      if (recoveredAddress.toLowerCase() !== normalizedAddress) {
        return res.status(401).json({
          error: "INVALID_SIGNATURE",
          message: "Signature verification failed. The signature does not match the provided address.",
        });
      }
    } catch (sigError) {
      console.error("Signature verification error:", sigError);
      return res.status(401).json({
        error: "INVALID_SIGNATURE",
        message: "Failed to verify signature. Please ensure you're signing the correct message.",
      });
    }

    // Attach admin info to request for use in route handlers
    req.adminAddress = normalizedAddress;
    req.adminMessage = message;

    // Authentication successful
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(500).json({
      error: "AUTH_ERROR",
      message: "An error occurred during authentication",
    });
  }
}

module.exports = {
  verifyAdminAuth,
};

