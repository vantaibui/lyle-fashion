import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';

export const metadata = metadataForRoute('search');
export const dynamic = 'force-dynamic';

export default function Page() {
  return <StaticRouteFoundation route="search" />;
}
