export const COMMISSION_RATES = {
  product: { base: 0.1, promoted: 0.2 },
  room: { base: 0.2, promoted: 0.3 },
};

export const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export const getCommissionRate = (listingType, promoted = false) => {
  const rates = COMMISSION_RATES[listingType] || COMMISSION_RATES.product;
  return promoted ? rates.promoted : rates.base;
};

export const calculateCommission = (amount, listingType, promoted = false) => {
  const rate = getCommissionRate(listingType, promoted);
  return {
    rate,
    amount: Math.round(Number(amount || 0) * rate),
    sellerReceives: Math.max(0, Math.round(Number(amount || 0) * (1 - rate))),
  };
};
