import { metadataForRoute } from '@/app/route-foundation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { OrderTrackingForm } from '@/modules/order/components/order-tracking-form';

export const metadata = metadataForRoute('orderTracking');
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Section>
      <Container size="narrow">
        <div className="grid gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">
              Theo dõi đơn hàng
            </h1>
            <p className="text-text-muted mt-2">
              Tra cứu bằng mã đơn và thông tin liên hệ. Kết quả công khai được
              giới hạn để bảo vệ riêng tư.
            </p>
          </div>
          <OrderTrackingForm />
        </div>
      </Container>
    </Section>
  );
}
