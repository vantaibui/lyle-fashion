'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      className="justify-start"
      isLoading={pending}
      onClick={async () => {
        setPending(true);
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.replace('/admin/login');
        router.refresh();
      }}
      variant="quiet"
    >
      Đăng xuất
    </Button>
  );
}
