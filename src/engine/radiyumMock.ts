/**
 * Mock Raydium swap execution
 * Used when Raydium is disabled / mocked
 */
export async function mockRaydiumSwap(
  amountIn: number,
  minOut: number
): Promise<string> {

  // simulate network + execution delay
  await new Promise((res) => setTimeout(res, 1200));

  // fake tx hash (looks real enough)
  const fakeTxHash =
    "MOCK_RAYDIUM_TX_" + Date.now().toString(36);
  return fakeTxHash;
}
