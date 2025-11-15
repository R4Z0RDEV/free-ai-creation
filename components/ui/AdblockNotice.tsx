'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAdblockDetector } from '@/hooks/useAdblockDetector';

const STORAGE_KEY = 'fac_adblock_dismissed_session';

export function AdblockNotice() {
  const { isBlocked, isChecking } = useAdblockDetector();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsDismissed(Boolean(sessionStorage.getItem(STORAGE_KEY)));
  }, []);

  const handleDismiss = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEY, '1');
    setIsDismissed(true);
  };

  const shouldRender = useMemo(
    () => isBlocked && !isChecking && !isDismissed,
    [isBlocked, isChecking, isDismissed],
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed bottom-6 inset-x-0 z-[60] flex justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="mb-2 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-purple-500/80 to-purple-400/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            광고 알림
          </div>
        </div>
        <div className="rounded-2xl border border-purple-500/40 bg-[#050014]/95 px-5 py-4 shadow-[0_0_40px_rgba(168,85,247,0.45)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-purple-100 tracking-wide">
                광고 차단기가 켜져 있는 것 같아요.
              </p>
              <p className="text-xs text-gray-300 leading-relaxed sm:text-sm">
                Free AI Creation은 광고 수익으로 무료 영상·이미지 생성 서비스를 유지하고 있어요.
                광고 추적 대신, 최소한의 배너 광고만 사용합니다. 원활한 이용을 위해 이 사이트에서만
                광고 차단기를 꺼 주시면 큰 도움이 됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition"
              >
                나중에 보기
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-400 px-4 py-1.5 text-xs font-medium text-black shadow-[0_0_24px_rgba(168,85,247,0.8)] hover:from-purple-400 hover:to-purple-300 transition"
              >
                광고 차단기 끄기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

