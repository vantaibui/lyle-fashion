'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import type { CustomerProfile } from '@/modules/customer/contracts/customer';

export function ProfileForm({ profile }: { profile: CustomerProfile }) {
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  return (
    <form
      className="grid max-w-2xl gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage('');
        const data = new FormData(event.currentTarget);
        const response = await fetch('/api/account/profile', {
          body: JSON.stringify({
            fullName: data.get('fullName'),
            phone: data.get('phone'),
            preferences: {
              marketingEmail: data.has('marketingEmail'),
              marketingSms: data.has('marketingSms'),
              newCollections: data.has('newCollections'),
            },
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
        });
        setPending(false);
        setMessage(
          response.ok
            ? 'Đã lưu thay đổi.'
            : 'Không thể lưu hồ sơ. Kiểm tra các trường và thử lại.',
        );
      }}
    >
      <div aria-live="polite">
        {message && (
          <FormMessage tone={message.startsWith('Đã') ? 'success' : 'error'}>
            {message}
          </FormMessage>
        )}
      </div>
      <FormField htmlFor="fullName" label="Họ và tên" required>
        <Input
          autoComplete="name"
          defaultValue={profile.fullName}
          id="fullName"
          name="fullName"
          required
        />
      </FormField>
      <FormField htmlFor="email" label="Email" required>
        <Input defaultValue={profile.email} disabled id="email" type="email" />
      </FormField>
      <FormField htmlFor="phone" label="Số điện thoại" required>
        <Input
          autoComplete="tel"
          defaultValue={profile.phone}
          id="phone"
          inputMode="tel"
          name="phone"
          required
          type="tel"
        />
      </FormField>
      <fieldset className="border-border grid gap-3 border p-4">
        <legend className="px-2 font-medium">Thông tin bạn muốn nhận</legend>
        <p className="text-text-muted text-sm">
          Thông báo giao dịch luôn được gửi khi cần. Tiếp thị là lựa chọn riêng.
        </p>
        <Checkbox
          defaultChecked={profile.preferences.marketingEmail}
          label="Email tiếp thị"
          name="marketingEmail"
        />
        <Checkbox
          defaultChecked={profile.preferences.marketingSms}
          label="SMS tiếp thị"
          name="marketingSms"
        />
        <Checkbox
          defaultChecked={profile.preferences.newCollections}
          label="Thông báo bộ sưu tập mới"
          name="newCollections"
        />
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <Button isLoading={pending} loadingLabel="Đang lưu…" type="submit">
          Lưu hồ sơ
        </Button>
        <Button variant="secondary">Yêu cầu xóa tài khoản</Button>
      </div>
    </form>
  );
}
