'use client';

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/Layout/AppShell";
import { PageHero } from "@/components/Layout/PageHero";
import { Button } from "@/components/ui/button";
import { ClipList } from "@/components/ClipList";
import { ClipSettings } from "@/components/ClipSettings";
import { PreviewPanel } from "@/components/PreviewPanel";
import { TimelineBar } from "@/components/TimelineBar";
import { generateVideo } from "@/lib/videoClient";
import { Clip, Project } from "@/lib/types";
import {
  createEmptyProject,
  createNewClip,
  duplicateClip,
  saveProjectToLocalStorage,
  loadProjectFromLocalStorage,
} from '@/lib/projectUtils';
import { toast } from 'sonner';
import { Zap, Loader2 } from 'lucide-react';

export default function VideoStudio() {
  const [project, setProject] = useState<Project>(createEmptyProject());
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [generatingClipId, setGeneratingClipId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [currentlyPlayingClipId, setCurrentlyPlayingClipId] = useState<
    string | null
  >(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [unlockingClipId, setUnlockingClipId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const flowPlaybackIndexRef = useRef(0);

  const getDisplayedVideoUrl = (clip: Clip | undefined) => {
    if (!clip) return undefined;
    if (clip.hasUnlockedClean && clip.cleanUrl) {
      return clip.cleanUrl;
    }
    return clip.videoUrl;
  };

  useEffect(() => {
    const savedProject = loadProjectFromLocalStorage();
    if (savedProject) {
      setProject(savedProject);
      setSelectedClipId(savedProject.clips[0]?.id ?? null);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveProjectToLocalStorage(project);
    }
  }, [project, isHydrated]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generatingClipId) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [generatingClipId]);

  const updateClip = (clipId: string, updates: Partial<Clip>) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((clip) =>
        clip.id === clipId ? { ...clip, ...updates } : clip
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddClip = () => {
    const newClip = createNewClip(project.clips.length);
    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, newClip],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedClipId(newClip.id);
    toast.success('Clip added');
  };

  const handleDuplicateClip = (clipId: string) => {
    const clipToDuplicate = project.clips.find((c) => c.id === clipId);
    if (clipToDuplicate) {
      const newClip = duplicateClip(clipToDuplicate, project.clips.length);
      setProject((prev) => ({
        ...prev,
        clips: [...prev.clips, newClip],
        updatedAt: new Date().toISOString(),
      }));
      toast.success('Clip duplicated');
    }
  };

  const handleDeleteClip = (clipId: string) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== clipId),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedClipId === clipId) {
      setSelectedClipId(project.clips[0]?.id || null);
    }
    toast.success('Clip deleted');
  };

  const handleMoveClipUp = (clipId: string) => {
    const index = project.clips.findIndex((c) => c.id === clipId);
    if (index > 0) {
      const newClips = [...project.clips];
      [newClips[index - 1], newClips[index]] = [
        newClips[index],
        newClips[index - 1],
      ];
      setProject((prev) => ({
        ...prev,
        clips: newClips,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleMoveClipDown = (clipId: string) => {
    const index = project.clips.findIndex((c) => c.id === clipId);
    if (index < project.clips.length - 1) {
      const newClips = [...project.clips];
      [newClips[index], newClips[index + 1]] = [
        newClips[index + 1],
        newClips[index],
      ];
      setProject((prev) => ({
        ...prev,
        clips: newClips,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleGenerateClip = async (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip || !clip.prompt.trim()) {
      toast.error('Prompt is required');
      return;
    }

    setGeneratingClipId(clipId);
    updateClip(clipId, { status: 'generating', errorMessage: undefined });

    try {
      const result = await generateVideo({
        prompt: clip.prompt,
        model: clip.model,
        duration: clip.duration,
        resolution: clip.resolution,
        seed: clip.seed,
        image: clip.image,
        aspect_ratio: clip.aspect_ratio,
        camera_fixed: clip.camera_fixed,
        last_frame_image: clip.last_frame_image,
        reference_images: clip.reference_images,
      });

      setGenerationProgress(100);
      updateClip(clipId, {
        status: 'ready',
        videoUrl: result.videoUrl,
        watermarkedUrl: result.videoUrl,
        hasUnlockedClean: false,
      });

      toast.success('Video generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate video';
      updateClip(clipId, {
        status: 'error',
        errorMessage,
      });
      toast.error('Failed to generate video');
    } finally {
      setTimeout(() => {
        setGeneratingClipId(null);
        setGenerationProgress(0);
      }, 500);
    }
  };

  const handleGenerateFlow = async () => {
    const clipsToGenerate = project.clips.filter(
      (clip) => clip.status === 'idle' || clip.status === 'error'
    );

    if (clipsToGenerate.length === 0) {
      toast.info('All clips are already generated');
      return;
    }

    setIsGeneratingFlow(true);

    for (let i = 0; i < clipsToGenerate.length; i++) {
      const clip = clipsToGenerate[i];

      if (!clip.prompt.trim()) {
        updateClip(clip.id, {
          status: 'error',
          errorMessage: 'Prompt is required',
        });
        continue;
      }

      setSelectedClipId(clip.id);
      setGeneratingClipId(clip.id);
      updateClip(clip.id, { status: 'generating', errorMessage: undefined });

      try {
        const result = await generateVideo({
          prompt: clip.prompt,
          model: clip.model,
          duration: clip.duration,
          resolution: clip.resolution,
          seed: clip.seed,
          image: clip.image,
          aspect_ratio: clip.aspect_ratio,
          camera_fixed: clip.camera_fixed,
          last_frame_image: clip.last_frame_image,
          reference_images: clip.reference_images,
        });

        updateClip(clip.id, {
          status: 'ready',
          videoUrl: result.videoUrl,
        });

        toast.success(
          `${clip.title} generated (${i + 1}/${clipsToGenerate.length})`
        );
      } catch (error) {
        console.error('Generation error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to generate video';
        updateClip(clip.id, {
          status: 'error',
          errorMessage,
        });
        toast.error(`Failed to generate ${clip.title}`);
      }

      setGeneratingClipId(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsGeneratingFlow(false);
    toast.success('Flow generation complete!');
  };

  const handlePlayFlow = () => {
    const readyClips = project.clips.filter(
      (clip) => clip.status === 'ready' && clip.videoUrl
    );

    if (readyClips.length === 0) {
      toast.error('No clips ready to play');
      return;
    }

    flowPlaybackIndexRef.current = 0;
    playClipAtIndex(readyClips, 0);
  };

  const handleUnlockWatermark = async (clipId: string) => {
    const clip = project.clips.find((c) => c.id === clipId);
    if (!clip || !clip.videoUrl || clip.hasUnlockedClean) {
      return;
    }

    setUnlockingClipId(clipId);

    try {
      // Simulate ad watching (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Extract media ID from the watermarked URL
      const urlMatch = clip.videoUrl.match(/\/api\/media\/([^/]+)$/);
      if (!urlMatch) {
        toast.error('워터마크 제거에 실패했습니다.');
        return;
      }

      const mediaId = urlMatch[1];

      // Call unlock API to get clean URL
      const response = await fetch('/api/unlock-video-watermark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlock watermark');
      }

      const data = await response.json();

      updateClip(clipId, {
        hasUnlockedClean: true,
        cleanUrl: data.cleanUrl,
      });

      toast.success('워터마크 없는 영상을 사용할 수 있습니다.');
    } catch (error) {
      console.error('Unlock watermark error:', error);
      toast.error('워터마크 제거에 실패했습니다.');
    } finally {
      setUnlockingClipId(null);
    }
  };

  const playClipAtIndex = (readyClips: Clip[], index: number) => {
    if (index >= readyClips.length) {
      setCurrentlyPlayingClipId(null);
      toast.success('Flow playback complete');
      return;
    }

    const clip = readyClips[index];
    setCurrentlyPlayingClipId(clip.id);
    setSelectedClipId(clip.id);

    setTimeout(() => {
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.src = clip.videoUrl!;
        videoElement.load();

        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing video:', error);
          });
        }

        videoElement.onended = () => {
          playClipAtIndex(readyClips, index + 1);
        };
      }
    }, 100);
  };

  const selectedClip =
    project.clips.find((c) => c.id === selectedClipId) || null;
  const isGenerating = generatingClipId !== null;

  return (
    <AppShell>
      <PageHero
        eyebrow="AI VIDEO STUDIO"
        title="Build multi-clip AI videos in one flow."
        description="Stack clips, write prompts, then generate everything with Seedance Lite on Replicate. Completely free to start, ad-supported, no login required."
        actions={
            <Button
              onClick={handleGenerateFlow}
              disabled={isGeneratingFlow || isGenerating}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.65)] hover:shadow-[0_0_35px_rgba(139,92,246,0.9)] transition-shadow"
            >
              {isGeneratingFlow ? (
                <>
                <Loader2 className="h-4 w-4 animate-spin" />
                  Generating flow…
                </>
              ) : (
                <>
                <Zap className="h-4 w-4" />
                Generate flow
                </>
              )}
            </Button>
        }
      >
        <p className="mt-3 text-xs text-white/60">
          Video model: Seedance Lite on Replicate
        </p>
      </PageHero>

      <section className="relative py-10 lg:py-12">
        <div className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-72 max-w-4xl section-glow bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),transparent_65%)]" />
        <div className="page-container relative space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="panel">
                <div className="panel-body">
                  <ClipList
                    clips={project.clips}
                    selectedClipId={selectedClipId}
                    onSelectClip={setSelectedClipId}
                    onAddClip={handleAddClip}
                    onDuplicateClip={handleDuplicateClip}
                    onDeleteClip={handleDeleteClip}
                    onMoveClipUp={handleMoveClipUp}
                    onMoveClipDown={handleMoveClipDown}
                  />
                </div>
              </div>

              {selectedClip && (
                <div className="panel">
                  <div className="panel-body">
                    <ClipSettings
                      clip={selectedClip}
                      onUpdateClip={updateClip}
                      onGenerateClip={handleGenerateClip}
                      isGenerating={generatingClipId === selectedClip.id}
                    />
                  </div>
                </div>
              )}
            </div>

                <PreviewPanel
              className="panel min-h-[560px]"
                  selectedClip={selectedClip}
                  clips={project.clips}
                  isGenerating={generatingClipId === selectedClip?.id}
                  generationProgress={generationProgress}
                  onPlayFlow={handlePlayFlow}
                  currentlyPlayingClipId={currentlyPlayingClipId}
                  onUnlockWatermark={handleUnlockWatermark}
                  unlockingClipId={unlockingClipId}
                  getDisplayedVideoUrl={getDisplayedVideoUrl}
                />
              </div>
            </div>
      </section>

      <TimelineBar
        clips={project.clips}
        selectedClipId={selectedClipId}
        currentlyPlayingClipId={currentlyPlayingClipId}
        onSelectClip={setSelectedClipId}
      />
    </AppShell>
  );
}
