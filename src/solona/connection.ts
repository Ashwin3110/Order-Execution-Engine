import { Connection, clusterApiUrl } from "@solana/web3.js";

// Create a read-only connection to devnet
export const solanaConnection = new Connection(
  clusterApiUrl("devnet"),
  "confirmed"
);
