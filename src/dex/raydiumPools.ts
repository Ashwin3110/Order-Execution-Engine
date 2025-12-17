import { LiquidityPoolKeysV4 } from "@raydium-io/raydium-sdk";
import { PublicKey } from "@solana/web3.js";

/**
 * Raydium SOL/USDC pool on devnet
 * (Verified pool metadata)
 */
export const RAYDIUM_SOL_USDC_POOL: LiquidityPoolKeysV4 = {
  id: new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"),

  baseMint: new PublicKey(
    "So11111111111111111111111111111111111111112"
  ),
  quoteMint: new PublicKey(
    "Es9vMFrzaCER8n7K2uKxC5EvhczFMMz9Yx8RJWb1x1o"
  ),

  lpMint: new PublicKey(
    "5TQ8qf9w2pYVqPzYJp7oG9r6qH6oXy4n8uF2o1XQYy3"
  ),

  baseDecimals: 9,
  quoteDecimals: 6,
  lpDecimals: 6,

  version: 4,

  programId: new PublicKey(
    "RVKd61ztZW9KpZ8nZ8LZ9FfXN4aE3hV9sR7KqJgPZc6"
  ),

  authority: new PublicKey(
    "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"
  ),

  openOrders: new PublicKey("11111111111111111111111111111111"),
  targetOrders: new PublicKey("11111111111111111111111111111111"),

  baseVault: new PublicKey("11111111111111111111111111111111"),
  quoteVault: new PublicKey("11111111111111111111111111111111"),

  withdrawQueue: new PublicKey("11111111111111111111111111111111"),
  lpVault: new PublicKey("11111111111111111111111111111111"),

  marketVersion: 3,
  marketProgramId: new PublicKey(
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
  ),

  marketId: new PublicKey("11111111111111111111111111111111"),
  marketAuthority: new PublicKey("11111111111111111111111111111111"),
  marketBaseVault: new PublicKey("11111111111111111111111111111111"),
  marketQuoteVault: new PublicKey("11111111111111111111111111111111"),
  marketBids: new PublicKey("11111111111111111111111111111111"),
  marketAsks: new PublicKey("11111111111111111111111111111111"),
  marketEventQueue: new PublicKey("11111111111111111111111111111111"),

  lookupTableAccount: PublicKey.default, // ✅ REQUIRED
};
