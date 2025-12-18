export async function mockMeteoraSwap(
  amountIn: number,
  minOut: number
): Promise<string> {
  console.log(
    `🧪 [MockMeteora] Simulating swap | amountIn=${amountIn}, minOut=${minOut}`
  );

  await new Promise((res) => setTimeout(res, 1000));

  const fakeTxHash =
    "MOCK_METEORA_TX_" + Date.now().toString(36);

  console.log(
    `🧪 [MockMeteora] Swap successful | txHash=${fakeTxHash}`
  );

  return fakeTxHash;
}
