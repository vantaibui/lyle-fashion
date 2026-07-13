import { Container } from '@/components/layout/container';
import { newArrivals } from '@/modules/marketing/home-content';
import { SaleProductCard } from '@/modules/marketing/components/sale-product-card';
import { SectionHeading } from '@/modules/marketing/components/section-heading';

export function NewArrivalGrid() {
  return (
    <Container className="py-10 md:py-16">
      <SectionHeading
        action={{ href: '/collections/new-arrival', label: 'Xem tất cả' }}
        title="New Arrival"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
        {newArrivals.map((product) => (
          <SaleProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
