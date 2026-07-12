import { cookies } from 'next/headers';

import { metadataForRoute } from '@/app/route-foundation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import {
  getCartForCookies,
  getFreeShippingProgress,
} from '@/modules/cart/server/cart-store';
import { CartPageClient } from '@/modules/cart/components/cart-page-client';

export const metadata = metadataForRoute('cart');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const result = getCartForCookies(await cookies());

  return (
    <Section>
      <Container>
        <CartPageClient
          initialCart={result.cart}
          initialFreeShippingProgress={getFreeShippingProgress(result.cart)}
        />
      </Container>
    </Section>
  );
}
