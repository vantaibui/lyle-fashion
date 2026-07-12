'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormMessage } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

type Tracking = {
  carrier: string;
  code: string;
  fulfillmentStatus: string;
  trackingCode: string;
};
export function OrderTrackingForm() {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [tracking, setTracking] = useState<Tracking | null>(null);
  return (
    <div className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError('');
          setTracking(null);
          const data = new FormData(event.currentTarget);
          const response = await fetch('/api/order-tracking', {
            body: JSON.stringify({
              code: data.get('code'),
              contact: data.get('contact'),
            }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          });
          const payload = (await response.json()) as {
            message?: string;
            tracking?: Tracking;
          };
          setPending(false);
          if (!response.ok || !payload.tracking) {
            setError(
              payload.message ?? 'Không thể xác minh thông tin tra cứu.',
            );
            return;
          }
          setTracking(payload.tracking);
        }}
      >
        <FormField htmlFor="code" label="Mã đơn hàng" required>
          <Input
            autoComplete="off"
            id="code"
            name="code"
            required
            spellCheck={false}
          />
        </FormField>
        <FormField
          description="Dùng email hoặc số điện thoại đã đặt hàng."
          htmlFor="contact"
          label="Thông tin xác minh"
          required
        >
          <Input autoComplete="email" id="contact" name="contact" required />
        </FormField>
        {error && (
          <FormMessage role="alert" tone="error">
            {error}
          </FormMessage>
        )}
        <Button isLoading={pending} loadingLabel="Đang tra cứu…" type="submit">
          Tra cứu đơn hàng
        </Button>
      </form>
      {tracking && (
        <section
          aria-live="polite"
          className="border-border grid gap-2 border p-5"
        >
          <h2 className="font-display text-2xl">Trạng thái giao hàng</h2>
          <p>
            Mã đơn: <span translate="no">{tracking.code}</span>
          </p>
          <p>Trạng thái: {tracking.fulfillmentStatus}</p>
          <p>Đơn vị: {tracking.carrier}</p>
          <p>
            Mã vận đơn: <span translate="no">{tracking.trackingCode}</span>
          </p>
        </section>
      )}
    </div>
  );
}
