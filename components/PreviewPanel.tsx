'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Download, Link2, Video, PlayCircle } from 'lucide-react';
import { SimpleProgress } from './SimpleProgress';
import { Clip } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  selectedClip: Clip | null;
  clips: Clip[];
  isGenerating: boolean;
  generationProgress?: number;
  onPlayFlow: () => void;
  currentlyPlayingClipId: string | null;
  className?: string;
}

export function PreviewPanel({
  selectedClip,
  clips,
  isGenerating,
  generationProgress = 0,
  onPlayFlow,
  currentlyPlayingClipId,
  className,
}: PreviewPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current && selectedClip?.videoUrl) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [selectedClip?.videoUrl]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (selectedClip?.videoUrl) {
      const a = document.createElement('a');
      a.href = selectedClip.videoUrl;
      a.download = `${selectedClip.title}.mp4`;
      a.click();
    }
  };

  const handleCopyLink = () => {
    if (selectedClip?.videoUrl) {
      navigator.clipboard.writeText(selectedClip.videoUrl);
    }
  };

  const hasReadyClips = clips.some((clip) => clip.status === 'ready' && clip.videoUrl);

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="border-b border-white/5 bg-white/[0.02] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlayPause}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
          <Button
            size="sm"
            variant="ghost"
            onClick={onPlayFlow}
            disabled={!hasReadyClips || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <PlayCircle className="mr-1 h-4 w-4" />
            <span className="text-xs">Play flow</span>
          </Button>
          <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        {!selectedClip && !isGenerating && (
          <div className="space-y-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-10 py-12 text-center text-white/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c4b5fd]/20 to-[#7c3aed]/20">
              <Video className="h-10 w-10 text-[#c4b5fd]" />
            </div>
            <div>
              <p className="text-base font-medium text-white/80">No clip selected</p>
              <p className="text-sm text-white/50">Choose a clip on the left to preview.</p>
            </div>
          </div>
        )}

        {selectedClip && !selectedClip.videoUrl && !isGenerating && (
          <div className="space-y-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-10 py-12 text-center text-white/60">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c4b5fd]/20 to-[#7c3aed]/20">
              <Video className="h-10 w-10 text-[#c4b5fd]" />
            </div>
            <div>
              <p className="text-base font-medium text-white/80">No video for this clip yet</p>
              <p className="text-sm text-white/50">
                Generate the clip to see it in the preview panel.
              </p>
            </div>
          </div>
        )}

        {isGenerating && selectedClip && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050508]/85 backdrop-blur">
            <div className="w-full max-w-md space-y-6 px-6 text-center">
              <div className="relative mx-auto h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c4b5fd] animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">
                  Generating {selectedClip.title}…
                </p>
                <p className="text-sm text-white/60">This may take a few moments.</p>
              </div>
              <div className="space-y-2">
                <SimpleProgress value={generationProgress} />
                <p className="text-xs text-white/50">{generationProgress}%</p>
              </div>
            </div>
          </div>
        )}

        {selectedClip?.videoUrl && !isGenerating && (
          <div className="flex w-full items-center justify-center">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.65)]">
              <video
                ref={videoRef}
                src={selectedClip.videoUrl}
                controls
                className="max-h-[520px] w-full rounded-2xl"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {currentlyPlayingClipId === selectedClip.id && (
                <div className="absolute right-4 top-4 rounded-full bg-[#c4b5fd]/20 px-3 py-1 text-xs font-semibold text-[#c4b5fd]">
                  Playing in flow
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
