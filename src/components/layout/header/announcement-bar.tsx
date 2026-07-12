import { Link } from '@/components/ui/link';
import type { NavigationItem } from '@/config/navigation';

export function AnnouncementBar({
  announcement,
}: {
  announcement?: NavigationItem;
}) {
  if (!announcement) return null;

  return (
    <aside
      aria-label="Thông báo"
      className="bg-surface-inverse text-text-inverse min-h-9 px-4 text-center text-xs tracking-wide"
    >
      <Link
        className="min-h-9 justify-center"
        href={announcement.href}
        variant="inverse"
      >
        {announcement.label}
      </Link>
    </aside>
  );
}
