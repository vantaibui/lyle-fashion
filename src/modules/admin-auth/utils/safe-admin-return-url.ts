const allowedOrigin = 'https://lyle.invalid';

export function safeAdminReturnUrl(value: string | null | undefined) {
  if (!value) return '/admin';
  try {
    const url = new URL(value, allowedOrigin);
    if (url.origin !== allowedOrigin || !url.pathname.startsWith('/admin')) {
      return '/admin';
    }
    if (url.pathname.startsWith('//') || url.pathname === '/admin/login') {
      return '/admin';
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/admin';
  }
}
