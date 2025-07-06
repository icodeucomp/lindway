export const calculateDiscountedPrice = (price: number, discount: number): number => {
  const safeDiscount = Math.min(100, Math.max(0, discount)); // clamp 0-100
  const result = price - price * (safeDiscount / 100);
  return parseFloat(result.toFixed(2));
};
