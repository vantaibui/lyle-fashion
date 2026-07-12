import { cookies } from 'next/headers';

import { metadataForRoute } from '@/app/route-foundation';
import { EmptyState } from '@/components/commerce/empty-state';
import { ErrorState } from '@/components/commerce/error-state';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { Link } from '@/components/ui/link';
import { getOrderForCookies } from '@/modules/cart/server/cart-store';
import { OrderSuccessSummary } from '@/modules/order/components/order-success-summary';

export const metadata = metadataForRoute('orderSuccess');
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orderCode = typeof params.order === 'string' ? params.order : undefined;
  const order = orderCode
    ? getOrderForCookies(await cookies(), orderCode)
    : null;

  return (
    <Section>
      <Container size="narrow">
        {!orderCode ? (
          <EmptyState
            action={<Link href="/shop">Tiếp tục mua sắm</Link>}
            description="Liên kết xác nhận này thiếu mã đơn hàng công khai."
            title="Chưa có thông tin đơn hàng"
          />
        ) : order ? (
          <OrderSuccessSummary order={order} />
        ) : (
          <ErrorState
            action={<Link href="/cart">Quay lại giỏ hàng</Link>}
            description="Không thể xác minh quyền xem đơn hàng này từ phiên hiện tại."
            title="Không thể hiển thị xác nhận đơn hàng"
          />
        )}
      </Container>
    </Section>
  );
}
