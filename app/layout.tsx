import './globals.css';
import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import { AdblockNotice } from '@/components/ui/AdblockNotice';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/Layout/PageTransition';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Free AI Creative Studio',
  description: 'Professional creative tools for everyone. Create stunning videos, music, and art.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3621018373095111"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-3621018373095111"
        />
      </head>
      <body className={cn(
        bricolage.className,
        "antialiased tracking-tight"
      )}>
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster richColors position="top-center" />
        <AdblockNotice />
      </body>
    </html>
  );
}
