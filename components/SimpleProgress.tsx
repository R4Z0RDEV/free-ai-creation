interface SimpleProgressProps {
  value: number;
  className?: string;
}

export function SimpleProgress({ value, className = '' }: SimpleProgressProps) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
