import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('stores');
export default function Page() {
  return <StaticRouteFoundation route="stores" />;
}
