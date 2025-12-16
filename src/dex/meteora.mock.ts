import { DexQuote } from "../types/dex";

const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export async function getMeteoraQuote(
  amount: number
): Promise<DexQuote> {
  await delay(2500); // slightly slower

  const priceImpact = Math.random() * 0.05;
  const outputAmount = amount * (102 - priceImpact); // slightly better base

  return {
    dex: "Meteora",
    inputAmount: amount,
    outputAmount,
  };
}
