import { cn } from '@/lib/utils/cn';

export function ProgressBar({
  current,
  label,
  max,
}: {
  current: number;
  label: string;
  max: number;
}) {
  const progress =
    max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  return (
    <div className="grid gap-2">
      <p className="text-text-muted text-sm">{label}</p>
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={current}
        className="bg-surface-muted h-2 overflow-hidden rounded-full"
        role="progressbar"
      >
        <span
          className={cn(
            'bg-action block h-full transition-[width] duration-[var(--duration-normal)] motion-reduce:transition-none',
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
