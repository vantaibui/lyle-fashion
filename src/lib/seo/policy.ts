const localhostHosts = new Set(['127.0.0.1', 'localhost']);

export function isPreviewLikeOrigin(siteUrl: string) {
  const url = new URL(siteUrl);
  return (
    localhostHosts.has(url.hostname) || url.hostname.endsWith('.vercel.app')
  );
}

export function isIndexingEnabled(options: {
  explicitFlag?: boolean;
  siteUrl: string;
}) {
  if (!options.explicitFlag) return false;
  return !isPreviewLikeOrigin(options.siteUrl);
}

export function createRobotsDirectives(indexable: boolean) {
  return {
    follow: indexable,
    index: indexable,
    nocache: !indexable,
  } as const;
}
