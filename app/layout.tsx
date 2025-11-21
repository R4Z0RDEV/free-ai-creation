import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';
import { AdblockNotice } from '@/components/ui/AdblockNotice';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Free AI Video Studio - Generate Videos with AI',
  description: 'Create stunning AI-generated videos using Seedance Lite and more. Free video generation service.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3943501773164281"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-3943501773164281"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-center" />
        <AdblockNotice />
        <Script
          src="https://t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
