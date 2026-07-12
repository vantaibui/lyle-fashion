import 'server-only';

import { revalidateTag } from 'next/cache';

export function revalidateCommerceTag(tag: string) {
  revalidateTag(tag, 'max');
}
