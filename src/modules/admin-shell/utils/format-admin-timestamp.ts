const formatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export function formatAdminTimestamp(isoTimestamp: string): string {
  return formatter.format(new Date(isoTimestamp));
}
