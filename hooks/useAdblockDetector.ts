'use client';

import { useEffect, useState } from 'react';

type DetectionState = {
  isBlocked: boolean;
  isChecking: boolean;
};

const STORAGE_KEY = 'fac_adblock_dismissed_session';

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

    if (sessionStorage.getItem(STORAGE_KEY)) {
      setState({ isBlocked: false, isChecking: false });
      return;
    }

    const bait = document.createElement('div');
    bait.className = 'adsbox ad-banner adsbygoogle pub_300x250';
    Object.assign(bait.style, {
      position: 'absolute',
      left: '-9999px',
      width: '300px',
      height: '250px',
      top: '0',
    });
    document.body.appendChild(bait);

    const timer = window.setTimeout(() => {
      const computedStyle = getComputedStyle(bait);
      const blocked =
        bait.offsetParent === null ||
        computedStyle.display === 'none' ||
        bait.clientHeight === 0;

      setState({ isBlocked: blocked, isChecking: false });
    }, 700);

    return () => {
      window.clearTimeout(timer);
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    };
  }, []);

  return state;
}

