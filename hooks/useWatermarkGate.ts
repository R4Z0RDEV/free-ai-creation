'use client';

import { useCallback, useState } from 'react';

export type WatermarkState = {
  /** 현재 결과물이 워터마크가 적용되어 있는지 */
  hasWatermark: boolean;
  /** 보상형 광고를 통해 워터마크 제거가 허용되었는지 */
  rewardUnlocked: boolean;
  /** 광고 시청 중 여부 (버튼 로딩 상태용) */
  isRewardLoading: boolean;
};

export function useWatermarkGate(initialEnabled = true) {
  const [state, setState] = useState<WatermarkState>({
    hasWatermark: initialEnabled,
    rewardUnlocked: false,
    isRewardLoading: false,
  });

  const showRewardAd = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return true as const;
  }, []);

  const requestRemoveWatermark = useCallback(async () => {
    if (!state.hasWatermark || state.rewardUnlocked) return;
    setState((prev) => ({ ...prev, isRewardLoading: true }));
    try {
      const ok = await showRewardAd();
      if (ok) {
        setState({
          hasWatermark: false,
          rewardUnlocked: true,
          isRewardLoading: false,
        });
      } else {
        setState((prev) => ({ ...prev, isRewardLoading: false }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isRewardLoading: false }));
    }
  }, [showRewardAd, state.hasWatermark, state.rewardUnlocked]);

  return {
    ...state,
    requestRemoveWatermark,
  };
}

