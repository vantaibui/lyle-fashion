const allowedOrigin = 'https://lyle.invalid';

export function safeReturnUrl(value: string | null | undefined) {
  if (!value) return '/account';
  try {
    const url = new URL(value, allowedOrigin);
    if (url.origin !== allowedOrigin || !url.pathname.startsWith('/')) {
      return '/account';
    }
    if (url.pathname.startsWith('//') || url.pathname === '/login') {
      return '/account';
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/account';
  }
}
