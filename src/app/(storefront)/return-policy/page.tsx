import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('returnPolicy');
export default function Page() {
  return <StaticRouteFoundation route="returnPolicy" />;
}
