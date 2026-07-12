import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('terms');
export default function Page() {
  return <StaticRouteFoundation route="terms" />;
}
