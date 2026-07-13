import { LoadingState } from '@/components/commerce/loading-state';

export function AdminRouteLoading() {
  return (
    <div className="px-4 py-6 lg:px-8">
      <LoadingState count={6} label="Đang tải dữ liệu quản trị…" />
    </div>
  );
}
