import { DexQuote } from "../types/dex";

/**
 * Mock Raydium pool address
 */
const RAYDIUM_POOL_ADDRESS =
  "RAYDIUM_MOCK_POOL_ADDRESS";

export async function getRaydiumQuote(
  inputAmount: number
): Promise<DexQuote> {
  /**
   * Simulate network latency
   */
  await new Promise((res) => setTimeout(res, 400));

  /**
   * Generate random realistic price
   * Range: 21.0 → 24.0 USDC per SOL
   */
  const minPrice = 19.5;
  const maxPrice = 26.5;

  const price =
    Math.random() * (maxPrice - minPrice) + minPrice;

  // Round to 2 decimals for realism
  const roundedPrice = Number(price.toFixed(2));

  const outputAmount = inputAmount * roundedPrice;

  return {
    dex: "Raydium",
    inputAmount,
    outputAmount,
    poolAddress: RAYDIUM_POOL_ADDRESS,
  };
}
