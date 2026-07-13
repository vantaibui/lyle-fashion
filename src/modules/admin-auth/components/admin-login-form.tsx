'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export function AdminLoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setError('');
        setPending(true);
        const data = new FormData(event.currentTarget);
        const response = await fetch('/api/admin/auth/login', {
          body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password'),
            returnTo,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const payload = (await response.json()) as {
          message?: string;
          returnTo?: string;
        };
        setPending(false);
        if (!response.ok) {
          setError(payload.message ?? 'Không thể đăng nhập.');
          return;
        }
        router.replace(payload.returnTo ?? '/admin');
        router.refresh();
      }}
    >
      {error && (
        <FormMessage role="alert" tone="error">
          {error}
        </FormMessage>
      )}
      <FormField htmlFor="email" label="Email quản trị" required>
        <Input
          autoComplete="username"
          id="email"
          name="email"
          required
          spellCheck={false}
          type="email"
        />
      </FormField>
      <FormField htmlFor="password" label="Mật khẩu" required>
        <Input
          autoComplete="current-password"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </FormField>
      <Button isLoading={pending} loadingLabel="Đang đăng nhập…" type="submit">
        Đăng nhập
      </Button>
    </form>
  );
}
