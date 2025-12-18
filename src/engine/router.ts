import { getRaydiumQuote } from "../dex/raydium";
import { getMeteoraQuote } from "../dex/meteora";
import { DexQuote } from "../types/dex";

export async function getBestDex(
  amount: number
): Promise<DexQuote> {
  const raydium: DexQuote = {
    dex: "Raydium",
    inputAmount: amount,
    outputAmount: amount * 22.5, // mock price
    poolAddress: "RAYDIUM_MOCK_POOL",
  };

  // Real Meteora quote
  const meteora = await getMeteoraQuote(amount);

  return raydium.outputAmount >= meteora.outputAmount
    ? raydium
    : meteora;
}