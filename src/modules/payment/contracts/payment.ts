export const paymentMethodTypes = ['cod', 'mock_vnpay'] as const;

export type PaymentMethodType = (typeof paymentMethodTypes)[number];

export const paymentStatuses = [
  'PENDING',
  'REQUIRES_ACTION',
  'PAID',
  'FAILED',
  'CANCELLED',
  'TIMED_OUT',
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export type PaymentMethodOption = {
  code: PaymentMethodType;
  description: string;
  developmentOnly: boolean;
  label: string;
  statusMessage?: string;
  supported: boolean;
};

export type PaymentAttempt = {
  method: PaymentMethodType;
  paymentStatus: PaymentStatus;
  redirectUrl?: string;
};
