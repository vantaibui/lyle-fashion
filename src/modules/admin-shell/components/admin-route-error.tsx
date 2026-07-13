'use client';

import { useEffect } from 'react';

import { ErrorState } from '@/components/commerce/error-state';
import { Button } from '@/components/ui/button';

type AdminRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function AdminRouteError({ error, reset }: AdminRouteErrorProps) {
  useEffect(() => {
    // Only the framework digest is safe until a redacting logger is approved.
    console.error('Admin route boundary error', { digest: error.digest });
  }, [error.digest]);

  return (
    <div className="px-4 py-6 lg:px-8">
      <ErrorState
        action={<Button onClick={reset}>Thử lại</Button>}
        description="Không thể tải dữ liệu quản trị. Vui lòng thử lại sau."
      />
    </div>
  );
}
