'use client';

'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

type BaseProps = {
  children: ReactNode;
  hasWatermark?: boolean;
};

export function WatermarkedPreview({ children, hasWatermark = true }: BaseProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      {children}
      {hasWatermark && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4">
          <div className="relative h-10 w-40 opacity-60 md:h-12 md:w-52">
            <Image
              src="/watermark.png"
              alt="free-ai-creation.com watermark"
              fill
              className="object-contain"
              priority={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

