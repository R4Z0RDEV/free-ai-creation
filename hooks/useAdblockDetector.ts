// hooks/useAdblockDetector.ts
'use client';

import { useEffect, useState } from 'react';
import { useAdBlockDetect } from 'multi-adblock-detect/lib/index.js';

type DetectionState = {
  isBlocked: boolean;
  isChecking: boolean;
};

const STORAGE_KEY = 'fac_adblock_dismissed_session';

export function useAdblockDetector(): DetectionState {
  const detected = useAdBlockDetect();
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

    setState({
      isBlocked: detected,
      isChecking: false,
    });
  }, [detected]);

  return state;
}