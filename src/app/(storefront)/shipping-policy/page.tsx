import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('shippingPolicy');
export default function Page() {
  return <StaticRouteFoundation route="shippingPolicy" />;
}
