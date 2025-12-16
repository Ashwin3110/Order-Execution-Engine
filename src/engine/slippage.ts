export function isSlippageAcceptable(
  expected: number,
  actual: number,
  maxSlippagePercent: number
): boolean {
  const minAcceptable =
    expected * (1 - maxSlippagePercent / 100);

  return actual >= minAcceptable;
}