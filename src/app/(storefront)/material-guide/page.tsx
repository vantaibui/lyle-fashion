import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('materialGuide');
export default function Page() {
  return <StaticRouteFoundation route="materialGuide" />;
}
