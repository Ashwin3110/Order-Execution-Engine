import { DexQuote } from "../types/dex";

const delay = (ms: number) =>
    new Promise((res) => setTimeout(res, ms));

export async function getRaydiumQuote(
    amount: number
): Promise<DexQuote> {
    await delay(2000); // simulate network delay

    const priceImpact = Math.random() * 0.05; // up to 5%
    const outputAmount = amount * (100 - priceImpact);

    return {
        dex: "Raydium",
        inputAmount: amount,
        outputAmount,
    };
}
