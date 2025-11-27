import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther, keccak256, toBytes } from "viem";

describe.skip("JualahVault", () => {
  const LEVEL_ID = "celo-basics";
  const REWARD_AMOUNT = parseEther("1"); // 1 token with 18 decimals

  async function deployFixture() {
    const [owner, oracle, user, other] = await hre.viem.getWalletClients();

    const mockToken = await hre.viem.deployContract("MockERC20", ["Mock cUSD", "cUSD"]);
    const vault = await hre.viem.deployContract("JualahVault", [
      oracle.account.address,
      mockToken.address,
      owner.account.address,
    ]);

    // Fund the vault with reward tokens
    await mockToken.write.mint([owner.account.address, REWARD_AMOUNT * 10n], {
      account: owner.account,
    });
    await mockToken.write.transfer([vault.address, REWARD_AMOUNT * 10n], {
      account: owner.account,
    });

    const publicClient = await hre.viem.getPublicClient();

    return { owner, oracle, user, other, mockToken, vault, publicClient };
  }

  function buildMessageHash(
    contractAddress: string,
    chainId: bigint,
    userAddress: string,
    levelId: string,
    rewardAmount: bigint,
    nonce: `0x${string}`,
  ) {
    // Simplify: use solidityPacked-like encoding via viem's toBytes on hex concat.
    const hexParts = [
      contractAddress.toLowerCase(),
      chainId.toString(16).padStart(64, "0"),
      userAddress.toLowerCase(),
      Buffer.from(levelId, "utf8").toString("hex"),
      rewardAmount.toString(16).padStart(64, "0"),
      nonce.slice(2),
    ];
    const encoded = toBytes(`0x${hexParts.join("")}`);
    return keccak256(encoded);
  }

  async function signRewardAuthorization(
    oracle: any,
    vaultAddress: string,
    userAddress: string,
    levelId: string,
    rewardAmount: bigint,
    nonce: `0x${string}`,
  ) {
    const publicClient = await hre.viem.getPublicClient();
    const { chain } = publicClient;
    const chainId = BigInt(chain?.id ?? 31337);

    const messageHash = buildMessageHash(
      vaultAddress,
      chainId,
      userAddress,
      levelId,
      rewardAmount,
      nonce,
    );

    // Sign the Ethereum signed message hash
    const signature = await oracle.signMessage({
      message: { raw: toBytes(messageHash) },
    });
    return signature;
  }

  it("allows a user to claim a reward with a valid oracle signature", async () => {
    const { oracle, user, mockToken, vault } = await loadFixture(deployFixture);

    const nonce = keccak256(toBytes("nonce-1"));
    const signature = await signRewardAuthorization(
      oracle,
      vault.address,
      user.account.address,
      LEVEL_ID,
      REWARD_AMOUNT,
      nonce,
    );

    const beforeBalance = await mockToken.read.balanceOf([user.account.address]);

    const receipt = await vault.write.claimReward([LEVEL_ID, REWARD_AMOUNT, nonce, signature], {
      account: user.account,
    });

    expect(receipt).to.be.ok;

    const afterBalance = await mockToken.read.balanceOf([user.account.address]);
    expect(afterBalance - beforeBalance).to.equal(REWARD_AMOUNT);

    const used = await vault.read.usedNonces([nonce]);
    expect(used).to.equal(true);
  });

  it("prevents replaying the same nonce", async () => {
    const { oracle, user, vault } = await loadFixture(deployFixture);

    const nonce = keccak256(toBytes("nonce-2"));
    const signature = await signRewardAuthorization(
      oracle,
      vault.address,
      user.account.address,
      LEVEL_ID,
      REWARD_AMOUNT,
      nonce,
    );

    await vault.write.claimReward([LEVEL_ID, REWARD_AMOUNT, nonce, signature], {
      account: user.account,
    });

    await expect(
      vault.write.claimReward([LEVEL_ID, REWARD_AMOUNT, nonce, signature], {
        account: user.account,
      }),
    ).to.be.rejectedWith("Nonce already used");
  });

  it("rejects signatures from an invalid signer", async () => {
    const { user, other, vault } = await loadFixture(deployFixture);

    const nonce = keccak256(toBytes("nonce-3"));
    const fakeSignature = await signRewardAuthorization(
      other,
      vault.address,
      user.account.address,
      LEVEL_ID,
      REWARD_AMOUNT,
      nonce,
    );

    await expect(
      vault.write.claimReward([LEVEL_ID, REWARD_AMOUNT, nonce, fakeSignature], {
        account: user.account,
      }),
    ).to.be.rejectedWith("Invalid signer");
  });
});



