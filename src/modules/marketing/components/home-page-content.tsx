import { HeroCarousel } from '@/modules/marketing/components/hero-carousel';
import { NewArrivalGrid } from '@/modules/marketing/components/new-arrival-grid';
import { PromoTiles } from '@/modules/marketing/components/promo-tiles';
import { SnapGallery } from '@/modules/marketing/components/snap-gallery';
import { heroSlides } from '@/modules/marketing/home-content';

export function HomePageContent() {
  return (
    <main>
      <h1 className="sr-only">LYLE Fashion — Thời trang nữ</h1>
      <HeroCarousel slides={heroSlides} />
      <PromoTiles />
      <NewArrivalGrid />
      <SnapGallery />
    </main>
  );
}
