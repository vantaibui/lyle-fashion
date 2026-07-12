import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';
export const metadata = metadataForRoute('privacyPolicy');
export default function Page() {
  return <StaticRouteFoundation route="privacyPolicy" />;
}
