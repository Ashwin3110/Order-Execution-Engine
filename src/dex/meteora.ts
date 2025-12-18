import { DexQuote } from "../types/dex";

/**
 * ⚠️ Replace with actual Meteora devnet pool address
 */
const METEORA_POOL_ADDRESS =
  "METEORA_DEVNET_POOL_ADDRESS";

export async function getMeteoraQuote(
  inputAmount: number
): Promise<DexQuote> {
  /**
   * Simulate network delay / RPC latency
   */
  await new Promise((res) => setTimeout(res, 500));

  /**
   * Generate random realistic price
   * Range: 21.5 → 24.5 USDC per SOL
   */
  const minPrice = 19.5;
  const maxPrice = 26.5;

  const price =
    Math.random() * (maxPrice - minPrice) + minPrice;

  // Optional: round to 2 decimals
  const roundedPrice = Number(price.toFixed(2));

  const outputAmount = inputAmount * roundedPrice;

  return {
    dex: "Meteora",
    inputAmount,
    outputAmount,
    poolAddress: METEORA_POOL_ADDRESS,
  };
}
