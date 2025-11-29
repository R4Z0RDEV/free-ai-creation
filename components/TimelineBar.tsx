'use client';

import { Clip } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Film } from 'lucide-react';

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
    <section className="sticky bottom-0 z-30 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="page-container py-3">
        {/* Header Info */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold uppercase tracking-wider text-white/40 text-[10px]">
              Timeline
            </span>
            <div className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/40">
              <Film className="h-3 w-3" />
              {clips.length} {clips.length === 1 ? 'clip' : 'clips'}
            </span>
            <span className="flex items-center gap-1.5 text-white/40">
              <Clock className="h-3 w-3" />
              {totalDuration}s total
            </span>
          </div>
        </div>

        {/* Timeline Clips */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          {clips.length === 0 && (
            <div className="flex h-12 w-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-white/30">
              Add clips to start building your video flow
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
                className={cn(
                  'group relative flex min-w-[140px] flex-col gap-1 rounded-xl border p-2 text-left transition-all duration-200',
                  isSelected
                    ? 'border-[#007AFF]/30 bg-[#007AFF]/10 shadow-sm'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10',
                  isPlaying && 'ring-1 ring-[#007AFF] ring-offset-1 ring-offset-black'
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={cn(
                    "text-[11px] font-medium transition-colors",
                    isSelected ? "text-[#007AFF]" : "text-white/70 group-hover:text-white/90"
                  )}>
                    Clip {index + 1}
                  </span>
                  {isPlaying && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.8)]" />
                  )}
                </div>

                <div className="flex w-full items-center justify-between gap-2">
                  <div className={cn(
                    "h-1 w-full rounded-full overflow-hidden",
                    isSelected ? "bg-[#007AFF]/20" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "h-full w-1/2 rounded-full",
                      isSelected ? "bg-[#007AFF]" : "bg-white/20"
                    )} />
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">
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
