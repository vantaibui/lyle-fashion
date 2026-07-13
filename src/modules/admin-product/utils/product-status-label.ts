import type { AdminProductStatus } from '@/modules/admin-product/contracts/admin-product';

const statusLabels: Readonly<Record<AdminProductStatus, string>> = {
  archived: 'Đã lưu trữ',
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
};

const statusTones: Readonly<
  Record<AdminProductStatus, 'neutral' | 'success' | 'warning'>
> = {
  archived: 'neutral',
  draft: 'warning',
  published: 'success',
};

export function productStatusLabel(status: AdminProductStatus): string {
  return statusLabels[status];
}

export function productStatusTone(status: AdminProductStatus) {
  return statusTones[status];
}
