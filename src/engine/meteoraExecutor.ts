import { PublicKey } from "@solana/web3.js";
import DLMM from "@meteora-ag/dlmm";
import BN from "bn.js";

import { solanaConnection } from "../solona/connection";
import { loadDevnetWallet } from "../solona/wallet";

/**
 * Execute Meteora DLMM swap (SOL → USDC)
 */
export async function executeMeteoraSwap(
  poolAddress: string,
  amountInSol: number,
  minOutUsdc: number
): Promise<string> {
  const wallet = loadDevnetWallet();

  /**
   * 1️⃣ LB Pair PUBLIC KEY
   * (DO NOT read from dlmm.lbPair)
   */
  const lbPair = new PublicKey(poolAddress);

  /**
   * 2️⃣ Create DLMM instance
   */
  const dlmm = await DLMM.create(
    solanaConnection,
    lbPair
  );

  /**
   * 3️⃣ Resolve token mint PUBLIC KEYS
   */
  const inToken: PublicKey = dlmm.tokenX.mint.address;
  const outToken: PublicKey = dlmm.tokenY.mint.address;

  /**
   * 4️⃣ Fetch bin array PUBLIC KEYS
   */
  const binArrays = await dlmm.getBinArrays();
  const binArraysPubkey: PublicKey[] =
    binArrays.map((b) => b.publicKey);

  if (binArraysPubkey.length === 0) {
    throw new Error("No active Meteora bin arrays found");
  }

  /**
   * 5️⃣ Prepare amounts
   */
  const inAmount = new BN(amountInSol * 1e9);     // SOL → lamports
  const minOutAmount = new BN(minOutUsdc * 1e6);  // USDC → base units

  /**
   * 6️⃣ Build and execute swap
   */
  const tx = await dlmm.swap({
    inAmount,
    minOutAmount,
    inToken,
    outToken,
    lbPair,
    binArraysPubkey,
    user: wallet.publicKey,
  });

  /**
   * 7️⃣ Sign & send transaction
   */
  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash =
    (await solanaConnection.getLatestBlockhash())
      .blockhash;

  tx.sign(wallet);

  const txHash =
    await solanaConnection.sendRawTransaction(
      tx.serialize()
    );

  await solanaConnection.confirmTransaction(
    txHash,
    "confirmed"
  );

  return txHash;
}
