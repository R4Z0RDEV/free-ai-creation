'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Download, Link2, Video, PlayCircle, Maximize2, X, Loader2 } from 'lucide-react';
import { SimpleProgress } from './SimpleProgress';
import { Clip } from '@/lib/types';
import { cn } from '@/lib/utils';

const DOWNLOAD_UNLOCK_KEY = 'fac_video_download_unlocked';

interface PreviewPanelProps {
  selectedClip: Clip | null;
  clips: Clip[];
  isGenerating: boolean;
  generationProgress?: number;
  onPlayFlow: () => void;
  currentlyPlayingClipId: string | null;
  className?: string;
  onUnlockWatermark?: (clipId: string) => void;
  unlockingClipId?: string | null;
  getDisplayedVideoUrl?: (clip: Clip | undefined) => string | undefined;
}

export function PreviewPanel({
  selectedClip,
  clips,
  isGenerating,
  generationProgress = 0,
  onPlayFlow,
  currentlyPlayingClipId,
  className,
  onUnlockWatermark,
  unlockingClipId,
  getDisplayedVideoUrl,
}: PreviewPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const [isAdUnlocking, setIsAdUnlocking] = useState(false);
  const [fullscreenClip, setFullscreenClip] = useState<Clip | null>(null);

  useEffect(() => {
    if (videoRef.current && selectedClip?.videoUrl) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [selectedClip?.videoUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDownloadUnlocked(
        window.sessionStorage.getItem(DOWNLOAD_UNLOCK_KEY) === '1'
      );
    }
  }, []);

  const unlockDownloadWithAd = async () => {
    if (downloadUnlocked) return true;
    setIsAdUnlocking(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(DOWNLOAD_UNLOCK_KEY, '1');
    }
    setDownloadUnlocked(true);
    setIsAdUnlocking(false);
    return true;
  };

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

  const handleDownload = async () => {
    if (!displayedVideoUrl) return;
    if (!downloadUnlocked) {
      await unlockDownloadWithAd();
    }
    const a = document.createElement('a');
    a.href = displayedVideoUrl;
    a.download = `${selectedClip?.title ?? 'video'}.mp4`;
    a.click();
  };

  const handleCopyLink = () => {
    if (selectedClip?.videoUrl) {
      navigator.clipboard.writeText(selectedClip.videoUrl);
    }
  };

  const handleOpenFullscreen = () => {
    if (displayedVideoUrl && selectedClip) {
      setFullscreenClip(selectedClip);
    }
  };

  const handleCloseFullscreen = () => {
    setFullscreenClip(null);
  };

  const hasReadyClips = clips.some((clip) => clip.status === 'ready' && clip.videoUrl);
  const downloadTitle = downloadUnlocked
    ? 'Download video'
    : isAdUnlocking
    ? '광고 시청 중...'
    : '광고 보고 다운로드';

  const displayedVideoUrl = getDisplayedVideoUrl
    ? getDisplayedVideoUrl(selectedClip ?? undefined)
    : selectedClip?.videoUrl;

  const canShowUnlockButton =
    selectedClip &&
    selectedClip.videoUrl &&
    selectedClip.watermarkedUrl &&
    !selectedClip.hasUnlockedClean &&
    onUnlockWatermark;

  const isUnlocking = unlockingClipId === selectedClip?.id;

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
            onClick={handleOpenFullscreen}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
            title="Fullscreen preview"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Fullscreen preview</span>
          </Button>
          <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={!selectedClip?.videoUrl || isGenerating || isAdUnlocking}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
            title={downloadTitle}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">{downloadTitle}</span>
          </Button>
          <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          {canShowUnlockButton && (
            <>
              <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectedClip && onUnlockWatermark(selectedClip.id)}
                disabled={isUnlocking || isGenerating}
                className="rounded-full border border-purple-500/60 bg-purple-500/10 px-3 text-xs text-purple-100 hover:bg-purple-500/20 disabled:opacity-50"
                title={isUnlocking ? '광고 시청 중...' : '광고 보고 워터마크 제거'}
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    <span className="hidden sm:inline">광고 시청 중...</span>
                  </>
                ) : (
                  <span className="hidden sm:inline">광고 보고 워터마크 제거</span>
                )}
              </Button>
            </>
          )}
          {selectedClip?.hasUnlockedClean && (
            <>
              <span className="hidden h-4 w-px bg-white/15 sm:inline-block" />
              <span className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs text-green-100">
                워터마크 제거됨
              </span>
            </>
          )}
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

        {displayedVideoUrl && !isGenerating && (
          <div className="flex w-full items-center justify-center">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.65)]">
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  src={displayedVideoUrl}
                  controls
                  playsInline
                  className="max-h-[520px] w-full rounded-2xl bg-black"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
              {currentlyPlayingClipId === selectedClip?.id && (
                <div className="absolute right-4 top-4 rounded-full bg-[#c4b5fd]/20 px-3 py-1 text-xs font-semibold text-[#c4b5fd]">
                  Playing in flow
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {fullscreenClip && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 px-4 py-10 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl space-y-4">
            <button
              type="button"
              onClick={handleCloseFullscreen}
              className="absolute right-2 top-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              aria-label="Close fullscreen"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video
                src={
                  getDisplayedVideoUrl
                    ? getDisplayedVideoUrl(fullscreenClip)
                    : fullscreenClip.videoUrl
                }
                controls
                autoPlay
                className="w-full rounded-2xl bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

