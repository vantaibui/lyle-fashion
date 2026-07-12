import { Link } from '@/components/ui/link';

export function BrandMark() {
  return (
    <Link
      aria-label="LYLE Fashion — Trang chủ"
      className="font-display min-h-11 text-2xl tracking-[0.16em] no-underline"
      href="/"
    >
      <span translate="no">LYLE</span>
    </Link>
  );
}
