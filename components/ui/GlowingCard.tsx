import React from 'react';
import { cn } from '@/lib/utils';

interface GlowingCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'hero';
}

export function GlowingCard({ className, children, variant = 'default', ...props }: GlowingCardProps) {
    return (
        <div
            className={cn(
                "relative group",
                className
            )}
            {...props}
        >
            {/* Background Glow Layer */}
            <div className={cn(
                "absolute -inset-0.5 bg-gradient-to-r from-neon-green/50 to-emerald-500/50 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200",
                variant === 'hero' && "opacity-30 blur-xl -inset-1"
            )} />

            {/* Stacked Card Effect - Bottom Layer */}
            <div className={cn(
                "absolute inset-0 bg-charcoal/80 rounded-[1.8rem] transform translate-y-2 scale-[0.98] transition-transform duration-300",
                variant === 'hero' && "translate-y-4 scale-[0.95]"
            )} />

            {/* Main Card Content */}
            <div className={cn(
                "relative h-full bg-charcoal/40 backdrop-blur-xl border border-white/10 rounded-[1.8rem] p-6 shadow-2xl overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-50",
                "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-neon-green/5 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500",
                variant === 'hero' && "p-10 md:p-16 border-white/20"
            )}>
                {/* Inner Glow Border */}
                <div className="absolute inset-0 rounded-[1.8rem] ring-1 ring-inset ring-white/10 group-hover:ring-neon-green/30 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
