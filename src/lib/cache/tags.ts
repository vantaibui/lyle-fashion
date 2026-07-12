const safeTagPart = /^[a-zA-Z0-9_-]+$/;

function cacheTag(scope: string, identifier?: string) {
  if (identifier && !safeTagPart.test(identifier)) {
    throw new Error(
      'Cache tag identifiers may contain letters, numbers, _ and -.',
    );
  }
  return identifier ? `lyle:${scope}:${identifier}` : `lyle:${scope}`;
}

export const cacheTags = {
  catalog: () => cacheTag('catalog'),
  collection: (id: string) => cacheTag('collection', id),
  content: (id: string) => cacheTag('content', id),
  product: (id: string) => cacheTag('product', id),
} as const;
