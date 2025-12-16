export interface TransactionResult {
  txHash: string;
  executedOutput: number;
}

export function buildAndSimulateTransaction(
  expectedOutput: number
): TransactionResult {
  // Simulate market movement (0–5%)
  const slippagePercent = Math.random() * 5;
  const executedOutput =
    expectedOutput * (1 - slippagePercent / 100);

  return {
    txHash: "mock-tx-" + Date.now(),
    executedOutput,
  };
}