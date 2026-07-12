import type { ShippingAddress } from '@/modules/customer/contracts/address';
import type {
  PaymentMethodType,
  PaymentStatus,
} from '@/modules/payment/contracts/payment';

export const orderStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const fulfillmentStatuses = [
  'UNFULFILLED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
] as const;

export type FulfillmentStatus = (typeof fulfillmentStatuses)[number];

export type OrderLineSnapshot = {
  compareAtPrice?: number;
  imageAlt: string;
  imageSrc: string;
  lineId: string;
  lineTotal: number;
  price: number;
  productId: string;
  productName: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  skuId: string;
};

export type PublicOrder = {
  code: string;
  createdAt: string;
  fulfillmentStatus: FulfillmentStatus;
  lines: OrderLineSnapshot[];
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  shippingAmount: number;
  subtotal: number;
  total: number;
};
