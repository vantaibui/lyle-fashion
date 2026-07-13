import { metadataForRoute } from '@/app/route-foundation';
import { HomePageContent } from '@/modules/marketing/components/home-page-content';

export const metadata = metadataForRoute('home');
export const revalidate = 3600;

export default function Page() {
  return <HomePageContent />;
}
