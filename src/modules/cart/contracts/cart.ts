import type { ProductBundleComponent } from '@/modules/product/contracts/product';
import type {
  AppliedPromotion,
  CartValidationState,
  PromotionAllocation,
} from '@/modules/promotion/contracts/promotion';

export const cartStatuses = ['active', 'converted', 'expired'] as const;

export type CartStatus = (typeof cartStatuses)[number];

export type CartValidationMessage = {
  lineId?: string;
  message: string;
  state: CartValidationState;
};

export type CartBundleComponentLine = {
  componentId: string;
  productId: string;
  productName: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  skuId: string;
  title: string;
};

export type CartLine = {
  availability: 'available' | 'unavailable';
  bundleComponentData?: CartBundleComponentLine[];
  bundleGroupId?: string;
  compareAtPrice?: number;
  imageAlt: string;
  imageSrc: string;
  lineId: string;
  lineTotal: number;
  lineType: 'bundle' | 'simple';
  price: number;
  productId: string;
  productName: string;
  promotionAllocations: PromotionAllocation[];
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  skuId: string;
  validationMessages: CartValidationMessage[];
  variantId: string;
};

export type CartTotals = {
  discountTotal: number;
  grandTotal: number;
  shippingEstimate: number;
  subtotal: number;
  taxTotal: number;
};

export type ShippingEstimate = {
  amount: number;
  districtCode?: string;
  districtName?: string;
  method: 'express' | 'pickup' | 'standard';
  provinceCode: string;
  provinceName: string;
  source: 'development-mock';
};

export type CartMergeSummary = {
  mergedLineCount: number;
  messages: string[];
};

export type Cart = {
  currency: 'VND';
  customerId?: string;
  expiresAt: string;
  id: string;
  lines: CartLine[];
  mergeSummary?: CartMergeSummary;
  promotionCodes: AppliedPromotion[];
  shippingEstimate?: ShippingEstimate;
  status: CartStatus;
  totals: CartTotals;
  validationMessages: CartValidationMessage[];
  version: number;
};

export type CartLineBuildComponent = Pick<
  ProductBundleComponent,
  'componentId' | 'productId' | 'productName' | 'quantity' | 'title'
> & {
  selectedColor: string;
  selectedSize: string;
  skuId: string;
};
