// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title JualahVault
 * @notice Reward vault for IlmQuest.
 *
 * The backend oracle validates an off-chain game session and signs a message
 * authorizing a reward for a specific user, level and amount.
 *
 * The frontend submits that signature to this contract via {claimReward},
 * which verifies the signature and releases cUSD (or any ERC20) to the user.
 *
 * Security properties:
 * - Uses ECDSA to verify the trusted oracle signer address.
 * - Binds the signature to:
 *      - this contract address
 *      - current chainId
 *      - msg.sender (the user claiming)
 *      - levelId (string identifier, e.g. "celo-basics")
 *      - rewardAmount (uint256, token units)
 *      - nonce (bytes32, unique per claim)
 * - Tracks used nonces to prevent replay attacks.
 */
contract JualahVault is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    /// @notice ERC20 token used for rewards (e.g. cUSD on Celo).
    IERC20 public immutable rewardToken;

    /// @notice Address of the trusted backend oracle that signs reward authorizations.
    address public adminSigner;

    /// @notice Tracks whether a nonce has already been used.
    mapping(bytes32 => bool) public usedNonces;

    /// @notice Emitted when the admin signer address is updated.
    event AdminSignerUpdated(address indexed oldSigner, address indexed newSigner);

    /// @notice Emitted when a reward is claimed.
    event RewardClaimed(
        address indexed user,
        string levelId,
        uint256 rewardAmount,
        bytes32 indexed nonce
    );

    /**
     * @param _adminSigner Address of the trusted backend oracle.
     * @param _rewardToken Address of the ERC20 reward token (e.g. cUSD).
     * @param _initialOwner Owner of the contract (can update signer, rescue funds).
     */
    constructor(address _adminSigner, address _rewardToken, address _initialOwner)
        Ownable(_initialOwner)
    {
        require(_adminSigner != address(0), "Invalid admin signer");
        require(_rewardToken != address(0), "Invalid reward token");
        require(_initialOwner != address(0), "Invalid owner");

        adminSigner = _adminSigner;
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @notice Owner can update the backend oracle signer address.
     */
    function setAdminSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid admin signer");
        address old = adminSigner;
        adminSigner = _newSigner;
        emit AdminSignerUpdated(old, _newSigner);
    }

    /**
     * @notice Owner can withdraw tokens from the vault (e.g. to top-up or migrate).
     * @dev This is an escape hatch; production deployments should use it carefully.
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(rewardToken.transfer(to, amount), "Token transfer failed");
    }

    /**
     * @notice Claim a reward using an off-chain signature from the trusted oracle.
     * @param levelId String identifier of the level/deck (e.g. "celo-basics").
     * @param rewardAmount Amount of tokens to claim (in smallest units).
     * @param nonce Unique nonce for this claim, chosen by the backend.
     * @param signature Signature produced by the backend over the claim data.
     *
     * The signed message payload is:
     * keccak256(abi.encodePacked(
     *   address(this),
     *   block.chainid,
     *   msg.sender,
     *   levelId,
     *   rewardAmount,
     *   nonce
     * ))
     * wrapped with the standard Ethereum signed message prefix.
     */
    function claimReward(
        string calldata levelId,
        uint256 rewardAmount,
        bytes32 nonce,
        bytes calldata signature
    ) external nonReentrant {
        require(!usedNonces[nonce], "Nonce already used");
        require(rewardAmount > 0, "Invalid reward amount");

        // Construct the message hash that the backend must have signed.
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                address(this),
                block.chainid,
                msg.sender,
                levelId,
                rewardAmount,
                nonce
            )
        );

        // Add the Ethereum Signed Message prefix to match eth_sign / signMessage.
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address recovered = ECDSA.recover(ethSignedMessageHash, signature);
        require(recovered == adminSigner, "Invalid signer");

        usedNonces[nonce] = true;

        require(
            rewardToken.transfer(msg.sender, rewardAmount),
            "Reward transfer failed"
        );

        emit RewardClaimed(msg.sender, levelId, rewardAmount, nonce);
    }
}


