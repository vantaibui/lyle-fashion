'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { CustomerAddress } from '@/modules/customer/contracts/customer';

export function AddressBook({ addresses }: { addresses: CustomerAddress[] }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  async function remove(id: string) {
    if (!window.confirm('Xóa địa chỉ này?')) return;
    setPending(true);
    const response = await fetch(
      `/api/account/addresses/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    );
    setPending(false);
    setMessage(response.ok ? 'Đã xóa địa chỉ.' : 'Không thể xóa địa chỉ.');
    if (response.ok) router.refresh();
  }
  return (
    <div className="grid gap-8">
      <div aria-live="polite">
        {message && (
          <FormMessage tone={message.startsWith('Đã') ? 'success' : 'error'}>
            {message}
          </FormMessage>
        )}
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <li className="border-border grid gap-2 border p-5" key={address.id}>
            <div className="flex justify-between gap-3">
              <strong>{address.fullName}</strong>
              {address.isDefaultShipping && (
                <span className="text-success text-sm">Mặc định</span>
              )}
            </div>
            <address className="text-text-muted break-words not-italic">
              {address.streetAddress}, {address.wardName},{' '}
              {address.districtName}, {address.provinceName}
              <br />
              {address.phone}
            </address>
            <Button
              disabled={pending}
              onClick={() => remove(address.id)}
              variant="quiet"
            >
              Xóa địa chỉ
            </Button>
          </li>
        ))}
      </ul>
      <form
        className="border-border grid max-w-2xl gap-4 border p-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setMessage('');
          const d = new FormData(event.currentTarget);
          const payload = Object.fromEntries(d);
          const response = await fetch('/api/account/addresses', {
            body: JSON.stringify({
              ...payload,
              isDefaultShipping: d.has('isDefaultShipping'),
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          });
          setPending(false);
          setMessage(
            response.ok
              ? 'Đã thêm địa chỉ.'
              : 'Địa chỉ chưa hợp lệ. Kiểm tra thông tin và thử lại.',
          );
          if (response.ok) {
            event.currentTarget.reset();
            router.refresh();
          }
        }}
      >
        <h2 className="font-display text-2xl">Thêm địa chỉ</h2>
        <FormField htmlFor="fullName" label="Họ và tên" required>
          <Input autoComplete="name" id="fullName" name="fullName" required />
        </FormField>
        <FormField htmlFor="phone" label="Số điện thoại" required>
          <Input
            autoComplete="tel"
            id="phone"
            inputMode="tel"
            name="phone"
            required
            type="tel"
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <CodeField id="province" label="Tỉnh / thành phố" />
          <CodeField id="district" label="Quận / huyện" />
          <CodeField id="ward" label="Phường / xã" />
        </div>
        <FormField htmlFor="streetAddress" label="Địa chỉ đường" required>
          <Input
            autoComplete="street-address"
            id="streetAddress"
            name="streetAddress"
            required
          />
        </FormField>
        <FormField htmlFor="deliveryNote" label="Ghi chú giao hàng">
          <Input id="deliveryNote" name="deliveryNote" />
        </FormField>
        <Checkbox
          label="Đặt làm địa chỉ giao hàng mặc định"
          name="isDefaultShipping"
        />
        <Button isLoading={pending} loadingLabel="Đang thêm…" type="submit">
          Thêm địa chỉ
        </Button>
        <p className="text-text-subtle text-xs">
          Danh mục hành chính hiện chờ API; nền tảng phát triển nhận mã và nhãn
          tách biệt.
        </p>
      </form>
    </div>
  );
}

function CodeField({ id, label }: { id: string; label: string }) {
  return (
    <div className="grid gap-2">
      <FormField htmlFor={`${id}Name`} label={label} required>
        <Input id={`${id}Name`} name={`${id}Name`} required />
      </FormField>
      <FormField
        htmlFor={`${id}Code`}
        label={`Mã ${label.toLowerCase()}`}
        required
      >
        <Input id={`${id}Code`} name={`${id}Code`} required />
      </FormField>
    </div>
  );
}
