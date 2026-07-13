import { EmptyState } from '@/components/commerce/empty-state';
import { Link } from '@/components/ui/link';

export function AdminForbidden() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <EmptyState
        action={<Link href="/admin">Về trang tổng quan</Link>}
        description="Tài khoản của bạn không có quyền truy cập chức năng này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn."
        title="Không đủ quyền truy cập"
      />
    </div>
  );
}
