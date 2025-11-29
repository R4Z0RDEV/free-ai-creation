import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/25 hover:bg-[#0066CC] hover:shadow-blue-500/40',
        destructive:
          'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
        outline:
          'border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-white/80 backdrop-blur-sm',
        secondary:
          'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/5',
        ghost: 'hover:bg-white/5 hover:text-white text-white/70',
        link: 'text-[#007AFF] underline-offset-4 hover:underline',
        glass: 'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:brightness-110 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
