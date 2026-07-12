import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('sustainability');
export default function Page() {
  return <StaticRouteFoundation route="sustainability" />;
}
