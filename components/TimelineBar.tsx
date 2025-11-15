// src/components/TimelineBar.tsx
'use client';

import { Clip } from '@/lib/types';

interface TimelineBarProps {
  clips: Clip[];
  selectedClipId: string | null;
  currentlyPlayingClipId: string | null;
  onSelectClip: (clipId: string) => void;
}

export function TimelineBar({
  clips,
  selectedClipId,
  currentlyPlayingClipId,
  onSelectClip,
}: TimelineBarProps) {
  const totalDuration = clips.reduce(
    (sum, clip) => sum + (clip.duration || 0),
    0
  );

  return (
    <section className="sticky bottom-0 z-30 border-t border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="page-container py-3">
        {/* 상단 정보 라인 */}
        <div className="mb-2 flex items-center justify-between text-xs text-white/55">
          <div className="flex items-center gap-2">
            <span className="font-medium uppercase tracking-[0.18em] text-white/60">
              Timeline
            </span>
            <span className="text-white/35">
              {clips.length} {clips.length === 1 ? 'clip' : 'clips'} ·{' '}
              {totalDuration}s total
            </span>
          </div>
        </div>

        {/* 타임라인 클립들 */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
          {clips.length === 0 && (
            <div className="text-xs text-white/35">
              Add a clip to start your flow.
            </div>
          )}

          {clips.map((clip, index) => {
            const isSelected = clip.id === selectedClipId;
            const isPlaying = clip.id === currentlyPlayingClipId;

            return (
              <button
                key={clip.id}
                type="button"
                onClick={() => onSelectClip(clip.id)}
                className={[
                  'relative flex min-w-[120px] items-center justify-between rounded-full border px-4 py-2 text-xs transition-all',
                  'border-white/15 bg-white/[0.03] hover:border-white/40',
                  isSelected &&
                    'border-transparent bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1] text-white shadow-[0_0_22px_rgba(168,85,247,0.45)]',
                  isPlaying && 'ring-2 ring-[#a855f7] ring-offset-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white/85">
                    Clip {index + 1}
                    </span>
                  <span className="text-[10px] text-white/70">
                    {clip.duration || 0}s
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
