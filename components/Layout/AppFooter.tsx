'use client';

import Link from 'next/link';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/90 backdrop-blur-xl">
      <div className="page-container py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              © {currentYear} Free AI Creation. All rights reserved.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="hidden h-3 w-px bg-white/10 md:inline" />
            <span className="text-gray-500">
              Ad-supported · No login required
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
