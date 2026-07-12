export function normalizeSearchQuery(value: string) {
  return value.normalize('NFC').trim().replace(/\s+/g, ' ');
}

export function searchResultsHref(value: string) {
  const query = normalizeSearchQuery(value);
  return query
    ? `/search?${new URLSearchParams({ q: query }).toString()}`
    : null;
}
