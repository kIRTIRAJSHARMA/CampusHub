export const COMMISSION_RATES = {
  product: { base: 0.1, promoted: 0.2 },
  room: { base: 0.2, promoted: 0.3 },
};

export const calculateCommission = (amount, listingType, promoted = false) => {
  const rates = COMMISSION_RATES[listingType] || COMMISSION_RATES.product;
  const rate = promoted ? rates.promoted : rates.base;
  const commissionAmount = Math.round(Number(amount || 0) * rate);

  return {
    commissionRate: rate,
    commissionAmount,
    sellerReceives: Math.max(0, Math.round(Number(amount || 0) - commissionAmount)),
  };
};
