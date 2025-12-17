import fs from "fs";
import { Keypair } from "@solana/web3.js";

export function loadDevnetWallet(): Keypair {
  const walletPath = process.env.SOLANA_WALLET_PATH;
  console.log(walletPath)
  if (!walletPath) {
    throw new Error("SOLANA_WALLET_PATH not set");
  }

  const secretKey = JSON.parse(
    fs.readFileSync(walletPath, "utf-8")
  );

  return Keypair.fromSecretKey(Uint8Array.from(secretKey));
}
