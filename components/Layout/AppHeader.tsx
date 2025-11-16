 'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import logoSrc from '@/public/logo.png';

export function AppHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/studio/video', label: 'AI Video' },
    { href: '/studio/image', label: 'AI Image' },
    { href: '/studio/upscale', label: 'Upscaling' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-white/5 bg-black/70 backdrop-blur-xl transition-all duration-300',
        scrolled
          ? 'shadow-[0_10px_40px_rgba(0,0,0,0.9)]'
          : 'shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
      )}
    >
      <div className="page-container">
        <div className="flex h-16 items-center justify-between md:h-18">
          <div className="flex items-center gap-3 text-white transition-colors hover:text-[#c4b5fd]">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={logoSrc}
                width={240}
                height={100}
                alt="Free AI Creation logo"
                className="rounded-full"
                priority
              />
            </Link>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40 sm:inline">
              Studio
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.24em] text-white/60 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative pb-1 transition-colors',
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="pointer-events-none absolute inset-x-0 -bottom-1 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1]" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/studio/video" className="pill-primary hidden sm:inline-flex">
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
