'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Download, Link2, Video, PlayCircle, Maximize2, X, Loader2, Lock, Unlock } from 'lucide-react';
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
      ? 'Watching ad...'
      : 'Watch ad to download';

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
      <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePlayPause}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </Button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={onPlayFlow}
            disabled={!hasReadyClips || isGenerating}
            className="h-8 rounded-full px-3 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <PlayCircle className="mr-1.5 h-4 w-4" />
            Play Flow
          </Button>

          <div className="flex-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpenFullscreen}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={!selectedClip?.videoUrl || isGenerating || isAdUnlocking}
            className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
            title={downloadTitle}
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            disabled={!selectedClip?.videoUrl || isGenerating}
            className="h-8 w-8 rounded-full p-0 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <Link2 className="h-4 w-4" />
          </Button>

          {canShowUnlockButton && (
            <>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectedClip && onUnlockWatermark(selectedClip.id)}
                disabled={isUnlocking || isGenerating}
                className="h-8 rounded-full border border-[#007AFF]/30 bg-[#007AFF]/10 px-3 text-xs font-medium text-[#007AFF] hover:bg-[#007AFF]/20 disabled:opacity-50"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Unlock className="mr-1.5 h-3 w-3" />
                    Remove Watermark
                  </>
                )}
              </Button>
            </>
          )}

          {selectedClip?.hasUnlockedClean && (
            <>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <span className="flex items-center rounded-full bg-[#007AFF]/10 px-3 py-1 text-[10px] font-medium text-[#007AFF]">
                <Unlock className="mr-1 h-3 w-3" />
                Clean Video
              </span>
            </>
          )}
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 bg-black/20">
        {!selectedClip && !isGenerating && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Video className="h-8 w-8 text-white/20" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">No clip selected</p>
              <p className="text-xs text-white/40 mt-1">Select a clip to preview</p>
            </div>
          </div>
        )}

        {selectedClip && !selectedClip.videoUrl && !isGenerating && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Video className="h-8 w-8 text-white/20" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/60">No video generated</p>
              <p className="text-xs text-white/40 mt-1">
                Click "Generate" to create your video
              </p>
            </div>
          </div>
        )}

        {isGenerating && selectedClip && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xs space-y-6 text-center">
              <div className="relative mx-auto h-16 w-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  Generating {selectedClip.title}
                </p>
                <p className="text-xs text-white/40">This may take a moment...</p>
              </div>
              <div className="space-y-2">
                <SimpleProgress value={generationProgress} className="h-1 bg-white/10" indicatorClassName="bg-[#007AFF]" />
                <p className="text-[10px] text-white/40 font-mono">{generationProgress}%</p>
              </div>
            </div>
          </div>
        )}

        {displayedVideoUrl && !isGenerating && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <video
                ref={videoRef}
                src={displayedVideoUrl}
                controls
                playsInline
                className="w-full h-auto max-h-[600px] bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {currentlyPlayingClipId === selectedClip?.id && (
                <div className="absolute right-4 top-4 rounded-full bg-[#007AFF]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                  Playing Flow
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {fullscreenClip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative w-full max-w-6xl">
            <button
              type="button"
              onClick={handleCloseFullscreen}
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <video
                src={
                  getDisplayedVideoUrl
                    ? getDisplayedVideoUrl(fullscreenClip)
                    : fullscreenClip.videoUrl
                }
                controls
                autoPlay
                className="w-full h-auto max-h-[85vh] bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

