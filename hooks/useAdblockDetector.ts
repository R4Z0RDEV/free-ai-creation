'use client';

import { useEffect, useState } from 'react';

type DetectionState = {
  isBlocked: boolean;
  isChecking: boolean;
};

const STORAGE_KEY = 'fac_adblock_dismissed_session';
const ADSENSE_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

export function useAdblockDetector(): DetectionState {
  const [state, setState] = useState<DetectionState>({
    isBlocked: false,
    isChecking: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      setState({ isBlocked: false, isChecking: false });
      return;
    }

    // 이번 세션에서 이미 닫았으면 굳이 검사 안 함
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setState({ isBlocked: false, isChecking: false });
      return;
    }

    let cancelled = false;

    const check = async () => {
      try {
        // 1) CSS 기반 감지용 bait 엘리먼트
        const bait = document.createElement('div');
        bait.className =
          'adsbox adsbygoogle ad-banner advertisement google-ad';
        Object.assign(bait.style, {
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '160px',
          height: '90px',
        });
        document.body.appendChild(bait);

        // 필터가 적용될 시간을 조금 줌
        await new Promise((r) => setTimeout(r, 600));

        const style = getComputedStyle(bait);
        const cssBlocked =
          bait.offsetHeight === 0 ||
          bait.clientHeight === 0 ||
          style.display === 'none' ||
          style.visibility === 'hidden';

        if (bait.parentNode) bait.parentNode.removeChild(bait);

        // 2) 네트워크 요청으로 감지 (uBlock Origin 확실히 잡힘)
        let netBlocked = false;
        try {
          const controller = new AbortController();
          const id = window.setTimeout(() => controller.abort(), 2500);

          // no-cors: 정상이면 응답은 오지만, 애드블록이면 TypeError로 떨어짐
          await fetch(ADSENSE_SRC + '?fac_test=1', {
            mode: 'no-cors',
            signal: controller.signal,
          });

          window.clearTimeout(id);
          netBlocked = false;
        } catch {
          netBlocked = true;
        }

        if (!cancelled) {
          const blocked = cssBlocked || netBlocked;
          setState({ isBlocked: blocked, isChecking: false });
        }
      } catch {
        if (!cancelled) {
          // 뭔가 이상하면 그냥 차단 안 된 것으로 처리
          setState({ isBlocked: false, isChecking: false });
        }
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}