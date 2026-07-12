import { cn } from '@/lib/utils/cn';

export type PaginationProps = {
  className?: string;
  currentPage: number;
  getHref: (page: number) => string;
  label?: string;
  totalPages: number;
};

export function Pagination({
  className,
  currentPage,
  getHref,
  label = 'Phân trang',
  totalPages,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {pages.map((page) => (
          <li key={page}>
            <a
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Trang ${page}`}
              className={cn(
                'hover:border-border inline-flex min-h-11 min-w-11 items-center justify-center rounded-xs border border-transparent text-sm',
                page === currentPage &&
                  'border-border-strong bg-action text-text-inverse',
              )}
              href={getHref(page)}
            >
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
