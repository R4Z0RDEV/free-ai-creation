'use client';

import { Children, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Tone = 'violet' | 'cyan' | 'amber';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: 'left' | 'center';
  tone?: Tone;
  children?: ReactNode;
};

const glowMap: Record<Tone, string> = {
  violet:
    'bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.45),_transparent_60%)]',
  cyan: 'bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.4),_transparent_60%)]',
  amber:
    'bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.4),_transparent_60%)]',
};

const eyebrowColorMap: Record<Tone, string> = {
  violet: 'text-[#c4b5fd]',
  cyan: 'text-[#67e8f9]',
  amber: 'text-[#facc15]',
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  align = 'left',
  tone = 'violet',
  children,
}: PageHeroProps) {
  const actionsArray = actions ? Children.toArray(actions) : [];

  return (
    <section className="relative isolate overflow-hidden border-b border-white/5">
      <div
        className={cn(
          'pointer-events-none absolute -inset-[18%] hero-glow mix-blend-screen',
          glowMap[tone]
        )}
      />
      <div className="relative page-container py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={cn(
            'flex flex-col gap-5',
            align === 'center' ? 'items-center text-center' : 'text-left'
          )}
        >
          <span className={cn('eyebrow', eyebrowColorMap[tone])}>{eyebrow}</span>
          <div
            className={cn(
              'space-y-4',
              align === 'center' ? 'max-w-3xl' : 'max-w-2xl'
            )}
          >
            <h1 className="headline-lg text-white">{title}</h1>
            {description && (
              <p className="text-sm md:text-base text-white/70 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {actionsArray.length > 0 && (
            <div
              className={cn(
                'flex w-full flex-wrap items-center gap-3',
                align === 'center' ? 'justify-center' : 'justify-start'
              )}
            >
              {actionsArray.map((action, index) => (
                <div key={index}>{action}</div>
              ))}
            </div>
          )}

          {children && (
            <div className="w-full">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

