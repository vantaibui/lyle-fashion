import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { StorefrontHeader } from '@/components/layout/storefront-header';
import { publicEnv } from '@/config/env/public';
import {
  createOrganizationJsonLd,
  createWebSiteJsonLd,
  serializeJsonLd,
} from '@/lib/seo/json-ld';
import {
  defaultSiteDescription,
  metadataDefaults,
  siteName,
} from '@/lib/seo/metadata';

import './globals.css';

export const metadata: Metadata = metadataDefaults;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const organizationJsonLd = createOrganizationJsonLd({
    name: siteName,
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
  });
  const websiteJsonLd = createWebSiteJsonLd({
    description: defaultSiteDescription,
    name: siteName,
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
  });

  return (
    <html lang="vi">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationJsonLd),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
          type="application/ld+json"
        />
        <StorefrontHeader />
        <div id="main-content" tabIndex={-1} className="scroll-mt-24">
          {children}
        </div>
      </body>
    </html>
  );
}
