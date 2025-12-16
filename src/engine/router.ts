import { getRaydiumQuote } from "../dex/raydium.mock";
import { getMeteoraQuote } from "../dex/meteora.mock";
import { DexQuote } from "../types/dex";

export async function getBestDex(amount: number): Promise<DexQuote> {
  // Fetch both quotes in parallel
  const [raydium, meteora] = await Promise.all([
    getRaydiumQuote(amount),
    getMeteoraQuote(amount),
  ]);

  // Compare output amount
  return raydium.outputAmount > meteora.outputAmount
    ? raydium
    : meteora;
}
