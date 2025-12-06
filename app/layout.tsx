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
  title: 'Free AI Creation - No Login AI Video, Image & Audio Generator',
  description: 'Create stunning AI videos, upscale images to 4K, generate 3D models and music for free. No credit card or sign-up required. Your all-in-one free AI creative studio.',
  keywords: [
    "Free AI Video Generator",
    "Text to Video AI",
    "AI Image Upscaler",
    "Background Remover",
    "AI Music Generator",
    "Text to 3D",
    "No Sign up AI",
    "Free AI Tools"
  ],
  openGraph: {
    locale: 'en_US',
    type: 'website',
    description: "Unlimited Free AI Tools. Create Videos, Images, and Audio instantly without login.",
    siteName: "Free AI Creation",
  },
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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17783777676"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17783777676');
            gtag('event', 'conversion', {
              'send_to': 'AW-17783777676/96nKCNOo9cwbEIzT-59C',
              'value': 1.0,
              'currency': 'KRW'
            });
          `}
        </Script>
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
