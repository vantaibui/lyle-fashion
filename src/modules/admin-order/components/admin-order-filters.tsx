import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  adminFulfillmentStatuses,
  adminOrderStatuses,
  adminPaymentStatuses,
} from '@/modules/admin-order/contracts/admin-order';
import type { AdminOrderSearchState } from '@/modules/admin-order/schemas/admin-order-search-params';
import {
  fulfillmentStatusLabel,
  orderStatusLabel,
  paymentStatusLabel,
} from '@/modules/admin-order/utils/order-status-label';

export function AdminOrderFilters({
  searchState,
}: {
  searchState: AdminOrderSearchState;
}) {
  return (
    <form
      action="/admin/orders"
      className="grid gap-4 md:grid-cols-4"
      method="get"
    >
      <FormField htmlFor="q" label="Mã đơn hàng">
        <Input
          defaultValue={searchState.q ?? ''}
          id="q"
          name="q"
          placeholder="LYLE-…"
          type="search"
        />
      </FormField>
      <FormField htmlFor="orderStatus" label="Trạng thái đơn hàng">
        <Select
          defaultValue={searchState.orderStatus ?? ''}
          id="orderStatus"
          name="orderStatus"
        >
          <option value="">Tất cả</option>
          {adminOrderStatuses.map((status) => (
            <option key={status} value={status}>
              {orderStatusLabel(status)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField htmlFor="paymentStatus" label="Trạng thái thanh toán">
        <Select
          defaultValue={searchState.paymentStatus ?? ''}
          id="paymentStatus"
          name="paymentStatus"
        >
          <option value="">Tất cả</option>
          {adminPaymentStatuses.map((status) => (
            <option key={status} value={status}>
              {paymentStatusLabel(status)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField htmlFor="fulfillmentStatus" label="Trạng thái giao vận">
        <Select
          defaultValue={searchState.fulfillmentStatus ?? ''}
          id="fulfillmentStatus"
          name="fulfillmentStatus"
        >
          <option value="">Tất cả</option>
          {adminFulfillmentStatuses.map((status) => (
            <option key={status} value={status}>
              {fulfillmentStatusLabel(status)}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="md:col-span-4">
        <Button size="sm" type="submit" variant="secondary">
          Áp dụng bộ lọc
        </Button>
      </div>
    </form>
  );
}
