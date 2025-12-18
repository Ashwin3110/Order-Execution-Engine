/**
 * Mock Raydium swap execution
 * Used when Raydium is disabled / mocked
 */
export async function mockRaydiumSwap(
  amountIn: number,
  minOut: number
): Promise<string> {
  console.log(
    `🧪 [MockRaydium] Simulating swap | amountIn=${amountIn}, minOut=${minOut}`
  );

  // simulate network + execution delay
  await new Promise((res) => setTimeout(res, 1200));

  // fake tx hash (looks real enough)
  const fakeTxHash =
    "MOCK_RAYDIUM_TX_" + Date.now().toString(36);

  console.log(
    `🧪 [MockRaydium] Swap successful | txHash=${fakeTxHash}`
  );

  return fakeTxHash;
}
