import type { ShippingAddress } from '@/modules/customer/contracts/address';
import type { PublicOrder } from '@/modules/order/contracts/order';
import type { PaymentMethodType } from '@/modules/payment/contracts/payment';

export type CheckoutContact = Pick<
  ShippingAddress,
  'email' | 'fullName' | 'phone'
>;

export type CheckoutInput = {
  acceptedTerms: boolean;
  address: ShippingAddress;
  contact: CheckoutContact;
  deliveryNote?: string;
  paymentMethod: PaymentMethodType;
  shippingMethod: 'express' | 'pickup' | 'standard';
};

export type CheckoutResult = {
  order: PublicOrder;
  redirectUrl: string;
};
