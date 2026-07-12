const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export function formatVnd(value: number): string {
  return vndFormatter.format(value);
}

export function formatVietnameseDate(value: Date | number | string): string {
  return dateFormatter.format(new Date(value));
}

export const formatDate = formatVietnameseDate;
