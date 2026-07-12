'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export function ForgotPasswordForm() {
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const data = new FormData(event.currentTarget);
        const response = await fetch('/api/auth/forgot-password', {
          body: JSON.stringify({ email: data.get('email') }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });
        const payload = (await response.json()) as { message: string };
        setMessage(payload.message);
        setPending(false);
      }}
    >
      {message && (
        <FormMessage aria-live="polite" tone="success">
          {message}
        </FormMessage>
      )}
      <FormField htmlFor="email" label="Email" required>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          required
          spellCheck={false}
          type="email"
        />
      </FormField>
      <Button isLoading={pending} loadingLabel="Đang gửi…" type="submit">
        Gửi hướng dẫn
      </Button>
    </form>
  );
}
