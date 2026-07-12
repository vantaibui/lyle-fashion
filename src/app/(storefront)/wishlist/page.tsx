import { metadataForRoute } from '@/app/route-foundation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { WishlistPageClient } from '@/modules/wishlist/components/wishlist-page-client';

export const metadata = metadataForRoute('wishlist');
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Section>
      <Container>
        <h1 className="font-display mb-8 text-3xl md:text-4xl">
          Danh sách yêu thích
        </h1>
        <WishlistPageClient />
      </Container>
    </Section>
  );
}
