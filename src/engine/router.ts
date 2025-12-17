import { getRaydiumQuote } from "../dex/raydium";
import { getMeteoraQuote } from "../dex/meteora";
import { DexQuote } from "../types/dex";

export async function getBestDex(
  amount: number
): Promise<DexQuote> {
  const [raydium, meteora] = await Promise.all([
    getRaydiumQuote(amount),
    getMeteoraQuote(amount),
  ]);

  return raydium.outputAmount >= meteora.outputAmount
    ? raydium
    : meteora;
}