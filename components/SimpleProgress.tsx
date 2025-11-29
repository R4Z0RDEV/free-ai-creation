import { cn } from '@/lib/utils';

interface SimpleProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export function SimpleProgress({ value, className, indicatorClassName }: SimpleProgressProps) {
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-[#007AFF] to-[#00C7BE] transition-all duration-300 ease-out",
          indicatorClassName
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
