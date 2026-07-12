import { publicEnv } from '@/config/env/public';

export function getSafeRedirect(
  candidate: string | null | undefined,
  fallback = '/',
) {
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return fallback;
  }

  try {
    const siteUrl = new URL(publicEnv.NEXT_PUBLIC_SITE_URL);
    const redirectUrl = new URL(candidate, siteUrl);
    return redirectUrl.origin === siteUrl.origin
      ? `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}
