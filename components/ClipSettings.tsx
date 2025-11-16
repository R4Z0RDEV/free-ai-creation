'use client';

import { Clip, Resolution, VideoModel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Info, Play, RefreshCw, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getVideoModelConfig, VideoModelId } from "@/lib/videoModelsConfig";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClipSettingsProps {
  clip: Clip;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onGenerateClip: (clipId: string) => void;
  isGenerating: boolean;
  className?: string;
}

export function ClipSettings({
  clip,
  onUpdateClip,
  onGenerateClip,
  isGenerating,
  className,
}: ClipSettingsProps) {
  const [title, setTitle] = useState(clip.title);
  const [prompt, setPrompt] = useState(clip.prompt);
  const [duration, setDuration] = useState(clip.duration);
  const [resolution, setResolution] = useState<Resolution>(clip.resolution);
  const [model, setModel] = useState<VideoModel>("seedance-1-lite");
  const [seed, setSeed] = useState<number | "">(clip.seed ?? "");
  const [initImageUrl, setInitImageUrl] = useState(clip.image ?? "");
  const [aspectRatio, setAspectRatio] = useState(clip.aspect_ratio ?? "16:9");
  const [cameraFixed, setCameraFixed] = useState(clip.camera_fixed ?? false);
  const [lastFrameImage, setLastFrameImage] = useState(
    clip.last_frame_image ?? "",
  );
  const [referenceImagesText, setReferenceImagesText] = useState<string>(
    clip.reference_images ? clip.reference_images.join(", ") : "",
  );
  const referenceFileInputRef = useRef<HTMLInputElement | null>(null);
  const initImageFileInputRef = useRef<HTMLInputElement | null>(null);
  const lastFrameFileInputRef = useRef<HTMLInputElement | null>(null);

  const currentModelId: VideoModelId = "seedance-lite";
  const modelConfig = getVideoModelConfig(currentModelId);

  useEffect(() => {
    if (duration < modelConfig.minDurationSeconds) {
      setDuration(modelConfig.minDurationSeconds);
    } else if (duration > modelConfig.maxDurationSeconds) {
      setDuration(modelConfig.maxDurationSeconds);
    }
  }, [currentModelId, modelConfig, duration]);

  const handleBlur = () => {
    onUpdateClip(clip.id, { title, prompt, duration, resolution, model });
  };

  const selectSeedanceLite = () => {
    const newModel: VideoModel = "seedance-1-lite";
    setModel(newModel);
    onUpdateClip(clip.id, { model: newModel });
  };

  const updateAdvancedField = (updates: Partial<Clip>) => {
    onUpdateClip(clip.id, updates);
  };

  const parseReferenceValues = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 4);

  const handleReferenceTextChange = (value: string) => {
    setReferenceImagesText(value);
    const parsed = parseReferenceValues(value);
    updateAdvancedField({
      reference_images: parsed.length ? parsed : undefined,
    });
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleReferenceImagesUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const selected = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 4);

    if (selected.length === 0) {
      return;
    }

    setReferenceImagesText(selected.map((file) => file.name).join(", "));

    try {
      const dataUrls = await Promise.all(selected.map(readFileAsDataUrl));
      updateAdvancedField({
        reference_images: dataUrls.length ? dataUrls : undefined,
      });
    } catch (error) {
      console.error("Failed to read reference image files:", error);
    } finally {
      if (referenceFileInputRef.current) {
        referenceFileInputRef.current.value = "";
      }
    }
  };

  const handleSingleImageUpload = async (
    field: "image" | "last_frame_image",
    file: File,
  ) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (field === "image") {
        setInitImageUrl(dataUrl);
        updateAdvancedField({ image: dataUrl });
      } else {
        setLastFrameImage(dataUrl);
        updateAdvancedField({ last_frame_image: dataUrl });
      }
    } catch (error) {
      console.error(`Failed to read ${field} file:`, error);
    }
  };

  const handleInitImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await handleSingleImageUpload("image", file);
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleLastFrameImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await handleSingleImageUpload("last_frame_image", file);
    if (event.target) {
      event.target.value = "";
    }
  };

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            Clip settings
          </p>
          <p className="text-xs text-white/40">
            Fine-tune the content, length, and model for this clip.
          </p>
        </div>
        {clip.status === 'ready' && clip.videoUrl && (
          <Button
            onClick={() => onGenerateClip(clip.id)}
            disabled={!canGenerate}
            size="sm"
            variant="outline"
            className="rounded-full border-white/20 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-40"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <Label
            htmlFor={`title-${clip.id}`}
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55"
          >
            Title
          </Label>
          <Input
            id={`title-${clip.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            placeholder="Clip title..."
            className="mt-2 border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus:border-white/40"
          />
        </div>

        <div>
          <Label
            htmlFor={`prompt-${clip.id}`}
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55"
          >
            Prompt
          </Label>
          <Textarea
            id={`prompt-${clip.id}`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onBlur={handleBlur}
            placeholder="Describe what you want to see in this clip..."
            rows={5}
            className="mt-2 border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-white/30 focus:border-white/40"
          />
          {prompt.trim().length === 0 && (
            <p className="mt-1 text-xs text-rose-300">Prompt is required.</p>
          )}
        </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
              Duration ({modelConfig.displayName})
          </Label>
            <p className="text-xs text-white/40">
              {modelConfig.minDurationSeconds}s – {modelConfig.maxDurationSeconds}s · Current:{' '}
              <span className="text-white/80">{duration}s</span>
            </p>
          <Slider
            value={[duration]}
              onValueChange={(values) => {
                const next = Math.min(
                  modelConfig.maxDurationSeconds,
                  Math.max(modelConfig.minDurationSeconds, values[0]),
                );
                setDuration(next);
              }}
            onValueCommit={handleBlur}
            min={modelConfig.minDurationSeconds}
            max={modelConfig.maxDurationSeconds}
            step={1}
              className="mt-3"
            />
          </div>

        <div className="space-y-3">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            Resolution
          </Label>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => {
                setResolution("480p" as Resolution);
                onUpdateClip(clip.id, { resolution: "480p" as Resolution });
              }}
              disabled={isGenerating}
              className={cn(
                'h-10 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.2em]',
                'border-transparent bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] text-white shadow-[0_0_22px_rgba(124,58,237,0.55)]'
              )}
            >
              480p
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
            AI Model
          </Label>
          <button
            type="button"
            onClick={selectSeedanceLite}
            disabled={isGenerating}
            className={cn(
              "flex w-full flex-col rounded-2xl border px-4 py-3 text-left text-sm font-semibold",
              "border-transparent bg-gradient-to-r from-[#c4b5fd]/80 via-[#a855f7]/80 to-[#7c3aed]/80 text-white shadow-[0_0_22px_rgba(124,58,237,0.45)]",
            )}
          >
            <p>Seedance Lite</p>
            <p className="text-xs font-normal text-white/40">
              Bytedance via Replicate
            </p>
          </button>
        </div>

        <TooltipProvider>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
              Advanced settings
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Seed
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Random seed. Set for reproducible generation.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                type="number"
                placeholder="Random"
                value={seed}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setSeed("");
                    updateAdvancedField({ seed: undefined });
                    return;
                  }
                  const parsed = Number(value);
                  if (!Number.isNaN(parsed)) {
                    setSeed(parsed);
                    updateAdvancedField({ seed: parsed });
                  }
                }}
                className="mt-1 border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-white/30 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Init Image URL
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Input image for image-to-video generation.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://..."
                  value={initImageUrl}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInitImageUrl(value);
                    updateAdvancedField({ image: value || undefined });
                  }}
                  className="flex-1 mt-1 border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-white/30 focus:border-white/40"
                />
              <input
                  ref={initImageFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInitImageUpload}
                />
                <Button
                  onClick={() => initImageFileInputRef.current?.click()}
                  variant="outline"
                  className="mt-1 flex items-center gap-1 px-3 text-xs uppercase tracking-[0.25em]"
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Aspect Ratio
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Video aspect ratio. Ignored if an image is used.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {["16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "9:21"].map(
                  (ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        setAspectRatio(ratio);
                        updateAdvancedField({ aspect_ratio: ratio });
                      }}
                      className={cn(
                        "flex-1 rounded-full border px-3 py-1.5 font-semibold",
                        aspectRatio === ratio
                          ? "border-transparent bg-white text-black"
                          : "border-white/20 text-white/70 hover:border-white/50",
                      )}
                    >
                      {ratio}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Camera Fixed
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Whether to fix camera position.
                  </TooltipContent>
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !cameraFixed;
                  setCameraFixed(next);
                  updateAdvancedField({ camera_fixed: next });
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                  cameraFixed
                    ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                    : "border-white/20 bg-white/5 text-white/70",
                )}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full border border-white/40",
                    cameraFixed && "border-transparent bg-emerald-400",
                  )}
              />
                {cameraFixed ? "Fixed" : "Free"}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Last Frame Image URL
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Input image for last frame generation. This only works if an image start frame is given too.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://..."
                  value={lastFrameImage}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLastFrameImage(value);
                    updateAdvancedField({ last_frame_image: value || undefined });
                  }}
                  className="flex-1 mt-1 border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-white/30 focus:border-white/40"
                />
                <input
                  ref={lastFrameFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLastFrameImageUpload}
                />
                <Button
                  onClick={() => lastFrameFileInputRef.current?.click()}
                  variant="outline"
                  className="mt-1 flex items-center gap-1 px-3 text-xs uppercase tracking-[0.25em]"
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </Button>
          </div>
        </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Reference Images
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-white/40 hover:text-white/80"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Reference images (1-4) to guide video generation. Cannot be used with 1080p or first/last frame images.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://url1, https://url2, ..."
                  value={referenceImagesText}
                  onChange={(e) => handleReferenceTextChange(e.target.value)}
                  className="flex-1 mt-1 border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-white/30 focus:border-white/40"
                />
                <input
                  ref={referenceFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleReferenceImagesUpload}
                />
                <Button
                  onClick={() => referenceFileInputRef.current?.click()}
                  variant="outline"
                  className="mt-1 flex gap-1 px-3 text-xs uppercase tracking-[0.25em]"
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </Button>
              </div>
              <p className="text-[11px] text-white/50">
                Upload up to 4 images or paste comma-separated URLs.
              </p>
            </div>
          </div>
        </TooltipProvider>

        {clip.status !== 'ready' && (
          <Button
            onClick={() => onGenerateClip(clip.id)}
            disabled={!canGenerate}
            className="w-full rounded-full bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#7c3aed] text-sm font-semibold shadow-[0_0_35px_rgba(124,58,237,0.55)] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate this clip
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
