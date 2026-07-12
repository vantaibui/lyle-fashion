export const cartValidationStates = [
  'VALID',
  'OUT_OF_STOCK',
  'INSUFFICIENT_STOCK',
  'PRICE_CHANGED',
  'PROMOTION_CHANGED',
  'PRODUCT_REMOVED',
  'VARIANT_REMOVED',
  'BUNDLE_INVALID',
  'SHIPPING_RECALCULATION_REQUIRED',
] as const;

export type CartValidationState = (typeof cartValidationStates)[number];

export const promotionResultCodes = [
  'APPLIED',
  'INVALID_CODE',
  'EXPIRED',
  'USAGE_LIMIT',
  'MINIMUM_SPEND',
  'PRODUCT_INELIGIBLE',
  'COLLECTION_INELIGIBLE',
  'NON_STACKABLE_CONFLICT',
] as const;

export type PromotionResultCode = (typeof promotionResultCodes)[number];

export type PromotionAllocation = {
  amount: number;
  code: string;
  lineId: string;
};

export type AppliedPromotion = {
  amount: number;
  code: string;
  description: string;
  isDevelopmentMock: boolean;
  title: string;
};

export type PromotionAttemptResult = {
  code: PromotionResultCode;
  message: string;
  promotion?: AppliedPromotion;
};
