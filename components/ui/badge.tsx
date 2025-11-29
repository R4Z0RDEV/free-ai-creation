import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-md',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20',
        secondary:
          'border-transparent bg-white/10 text-white/90 hover:bg-white/20',
        destructive:
          'border-transparent bg-red-500/10 text-red-400 border-red-500/20',
        outline: 'text-white/70 border-white/20',
        glass: 'border-white/10 bg-white/5 text-white/80 shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
