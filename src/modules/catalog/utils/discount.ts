export function calculateDiscountPercentage(
  amount: number,
  compareAtAmount: number | undefined,
  isDisplayAllowed: boolean,
) {
  if (
    !isDisplayAllowed ||
    compareAtAmount === undefined ||
    !Number.isInteger(amount) ||
    !Number.isInteger(compareAtAmount) ||
    amount < 0 ||
    compareAtAmount <= amount
  ) {
    return null;
  }

  return Math.round(((compareAtAmount - amount) / compareAtAmount) * 100);
}
