import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';

export const metadata = metadataForRoute('home');
export const revalidate = 3600;

export default function Page() {
  return <StaticRouteFoundation route="home" />;
}
