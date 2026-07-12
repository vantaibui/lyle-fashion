'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PublicOrder } from '@/modules/order/contracts/order';

export function ReturnRequestForm({ orders }: { orders: PublicOrder[] }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const eligible = orders.filter(
    (order) => order.fulfillmentStatus === 'DELIVERED',
  );
  if (eligible.length === 0)
    return <p>Hiện không có đơn hàng đủ điều kiện để bắt đầu yêu cầu.</p>;
  return (
    <form
      className="border-border grid max-w-2xl gap-5 border p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage('');
        const data = new FormData(event.currentTarget);
        const response = await fetch('/api/account/returns', {
          body: JSON.stringify(Object.fromEntries(data)),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        setPending(false);
        setMessage(
          response.ok
            ? 'Đã gửi yêu cầu đổi trả.'
            : 'Không thể gửi yêu cầu. Kiểm tra điều kiện và thử lại.',
        );
        if (response.ok) router.refresh();
      }}
    >
      <h2 className="font-display text-2xl">Tạo yêu cầu</h2>
      <FormField htmlFor="orderId" label="Đơn hàng" required>
        <Select id="orderId" name="orderId" required>
          {eligible.map((order) => (
            <option key={order.code} value={order.code}>
              {order.code}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField htmlFor="skuId" label="Sản phẩm" required>
        <Select id="skuId" name="skuId" required>
          {eligible.flatMap((order) =>
            order.lines.map((line) => (
              <option key={`${order.code}-${line.skuId}`} value={line.skuId}>
                {line.productName} · {line.selectedSize}
              </option>
            )),
          )}
        </Select>
      </FormField>
      <FormField htmlFor="quantity" label="Số lượng" required>
        <Select id="quantity" name="quantity" required>
          <option value="1">1</option>
        </Select>
      </FormField>
      <FormField htmlFor="reasonCode" label="Lý do" required>
        <Select id="reasonCode" name="reasonCode" required>
          <option value="wrong_size">Sai kích cỡ</option>
          <option value="not_expected">Không như mong đợi</option>
          <option value="damaged">Sản phẩm hư hỏng</option>
          <option value="wrong_item">Giao sai sản phẩm</option>
          <option value="quality">Vấn đề chất lượng</option>
          <option value="other">Khác</option>
        </Select>
      </FormField>
      <FormField htmlFor="note" label="Ghi chú">
        <Textarea id="note" maxLength={500} name="note" />
      </FormField>
      {message && (
        <FormMessage
          aria-live="polite"
          tone={message.startsWith('Đã') ? 'success' : 'error'}
        >
          {message}
        </FormMessage>
      )}
      <Button isLoading={pending} loadingLabel="Đang gửi…" type="submit">
        Gửi yêu cầu
      </Button>
      <p className="text-text-subtle text-xs">
        Cửa sổ đổi trả, bundle, khuyến mãi và hoàn tiền vẫn chờ chính sách được
        duyệt; máy chủ sẽ là nguồn xác nhận cuối cùng.
      </p>
    </form>
  );
}
