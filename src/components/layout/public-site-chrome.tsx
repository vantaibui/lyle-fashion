import type { ReactNode } from 'react';

import { StorefrontFooter } from '@/components/layout/footer/storefront-footer';
import { StorefrontHeader } from '@/components/layout/storefront-header';
import { publicEnv } from '@/config/env/public';
import {
  createOrganizationJsonLd,
  createWebSiteJsonLd,
  serializeJsonLd,
} from '@/lib/seo/json-ld';
import { defaultSiteDescription, siteName } from '@/lib/seo/metadata';

/** Shared chrome for public storefront and account routes. Admin routes use AdminShell instead. */
export function PublicSiteChrome({ children }: { children: ReactNode }) {
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
    <>
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
      <div className="scroll-mt-24" id="main-content" tabIndex={-1}>
        {children}
      </div>
      <StorefrontFooter />
    </>
  );
}
