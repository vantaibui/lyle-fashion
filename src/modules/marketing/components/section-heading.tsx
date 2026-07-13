import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionHeading({
  action,
  title,
}: {
  action?: { href: string; label: string };
  title: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <h2 className="text-text-strong text-xl font-semibold tracking-wide uppercase md:text-2xl">
        {title}
      </h2>
      {action && (
        <Link
          className="text-action-muted hover:text-text-strong shrink-0 text-sm transition-colors"
          href={action.href}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
