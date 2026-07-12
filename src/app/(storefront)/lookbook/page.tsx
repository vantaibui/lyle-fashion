import {
  metadataForRoute,
  StaticRouteFoundation,
} from '@/app/route-foundation';

export const metadata = metadataForRoute('lookbook');
export const revalidate = 3600;

export default function Page() {
  return <StaticRouteFoundation route="lookbook" />;
}
