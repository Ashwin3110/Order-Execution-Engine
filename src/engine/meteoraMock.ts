export async function mockMeteoraSwap(
  amountIn: number,
  minOut: number
): Promise<string> {
  await new Promise((res) => setTimeout(res, 1000));

  const fakeTxHash =
    "MOCK_METEORA_TX_" + Date.now().toString(36);
  return fakeTxHash;
}
