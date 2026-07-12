export const returnStatuses = [
  'REQUESTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'WAITING_FOR_ITEM',
  'ITEM_RECEIVED',
  'REFUND_PROCESSING',
  'COMPLETED',
  'CANCELLED',
] as const;
export type ReturnStatus = (typeof returnStatuses)[number];

export type ReturnRequest = {
  id: string;
  orderCode: string;
  orderId: string;
  reasonCode: string;
  status: ReturnStatus;
  submittedAt: string;
};
