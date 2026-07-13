import type { ReactNode } from 'react';

export function DashboardCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="border-border-subtle bg-surface rounded-xs border p-5">
      <h2 className="text-text-muted text-sm font-semibold tracking-wide uppercase">
        {title}
      </h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

export function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-text-muted text-sm">{label}</span>
      <span className="font-display text-2xl tabular-nums">{value}</span>
    </div>
  );
}
