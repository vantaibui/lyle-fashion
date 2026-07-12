import { publicEnv } from '@/config/env/public';

function normalizePathname(pathname: string) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (normalized === '/') return normalized;
  return normalized.replace(/\/+$/, '');
}

export function canonicalUrl(pathname: string) {
  const normalized = normalizePathname(pathname);
  const url = new URL(normalized, publicEnv.NEXT_PUBLIC_SITE_URL);
  url.hash = '';
  url.search = '';
  return url.toString();
}

export function canonicalUrlWithSearch(pathname: string) {
  const normalized = normalizePathname(pathname);
  const url = new URL(normalized, publicEnv.NEXT_PUBLIC_SITE_URL);
  url.hash = '';
  url.searchParams.sort();
  return url.toString();
}
