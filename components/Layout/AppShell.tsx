// src/components/Layout/AppShell.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { AdsBottomBar, AdsLeftBar, AdsRightBar } from '../AdBars';

type AdBannerProps = {
  slot: string;
  className?: string;
};

function AdBanner({ slot, className }: AdBannerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      (window as typeof window & { adsbygoogle?: unknown }).adsbygoogle =
        (window as typeof window & { adsbygoogle?: unknown }).adsbygoogle || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ; (window as any).adsbygoogle.push({});
      setIsReady(true);
    } catch (error) {
      console.error('Failed to load AdSense slot:', error);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ins
      className={cn(
        'adsbygoogle block',
        'min-h-[280px] w-[160px] rounded-2xl bg-black/70 p-2 shadow-[0_30px_70px_rgba(0,0,0,0.6)]',
        className,
      )}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3621018373095111"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

type Props = {
  children: ReactNode;
  className?: string;
  showAds?: boolean;
  withFooter?: boolean;
};

export function AppShell({
  children,
  className,
  showAds = false,
  withFooter = true,
}: Props) {
  const adSlots = ['1688661815', '1688661815'];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as typeof window & { adsbygoogle?: unknown }).adsbygoogle =
      (window as typeof window & { adsbygoogle?: unknown }).adsbygoogle || [];
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 -top-48 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.5),transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_60%)]" />
      </div>
      <div className="relative flex min-h-screen flex-col">
        <AppHeader />
        <main className={cn('flex-1', className)}>{children}</main>
        {withFooter && <AppFooter />}
      </div>
      <AdsLeftBar />
      <AdsRightBar />
      <AdsBottomBar />
      <div className="pointer-events-auto fixed top-1/4 left-3 hidden flex-col gap-6 lg:flex">
        <div className="w-[160px]">
          <AdBanner slot="1688661815" />
        </div>
      </div>
      <div className="pointer-events-auto fixed top-1/4 right-3 hidden flex-col gap-6 lg:flex">
        <div className="w-[160px]">
          <AdBanner slot="1688661815" />
        </div>
      </div>
    </div>
  );
}