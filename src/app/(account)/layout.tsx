import type { ReactNode } from 'react';

import { PublicSiteChrome } from '@/components/layout/public-site-chrome';

export default function AccountGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PublicSiteChrome>{children}</PublicSiteChrome>;
}
