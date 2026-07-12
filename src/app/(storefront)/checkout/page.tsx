import { cookies } from 'next/headers';

import { metadataForRoute } from '@/app/route-foundation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { vietnamAddressOptions } from '@/config/vietnam-addresses';
import {
  getCartForCookies,
  getFreeShippingProgress,
  getPaymentMethodOptions,
} from '@/modules/cart/server/cart-store';
import { CheckoutPageClient } from '@/modules/checkout/components/checkout-page-client';

export const metadata = metadataForRoute('checkout');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const result = getCartForCookies(await cookies());

  return (
    <Section>
      <Container>
        <CheckoutPageClient
          addressOptions={vietnamAddressOptions}
          initialCart={result.cart}
          initialFreeShippingProgress={getFreeShippingProgress(result.cart)}
          paymentOptions={getPaymentMethodOptions()}
        />
      </Container>
    </Section>
  );
}
