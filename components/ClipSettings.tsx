'use client';

import { Clip, Resolution, VideoModel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Info, Play, RefreshCw, Upload, Settings2 } from "lucide-react";
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
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Clip settings
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            Configure generation parameters
          </p>
        </div>
        {clip.status === 'ready' && clip.videoUrl && (
          <Button
            onClick={() => onGenerateClip(clip.id)}
            disabled={!canGenerate}
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-white/10 bg-white/5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Regenerate
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor={`title-${clip.id}`} className="label-glass">
            Title
          </Label>
          <Input
            id={`title-${clip.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            placeholder="Clip title..."
            className="input-glass mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor={`prompt-${clip.id}`} className="label-glass">
            Prompt
          </Label>
          <Textarea
            id={`prompt-${clip.id}`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onBlur={handleBlur}
            placeholder="Describe what you want to see in this clip..."
            rows={4}
            className="input-glass mt-1.5 resize-none"
          />
          {prompt.trim().length === 0 && (
            <p className="mt-1.5 text-xs text-rose-400">Prompt is required.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="label-glass">
              Duration
            </Label>
            <span className="text-xs font-medium text-white/60">{duration}s</span>
          </div>
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
            className="py-2"
          />
          <div className="flex justify-between text-[10px] text-white/30 font-medium uppercase tracking-wider">
            <span>{modelConfig.minDurationSeconds}s</span>
            <span>{modelConfig.maxDurationSeconds}s</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="label-glass">
            Resolution
          </Label>
          <div className="grid grid-cols-1">
            <button
              type="button"
              onClick={() => {
                setResolution("480p" as Resolution);
                onUpdateClip(clip.id, { resolution: "480p" as Resolution });
              }}
              disabled={isGenerating}
              className={cn(
                'h-9 w-full rounded-lg border text-xs font-medium transition-all',
                'border-[#007AFF]/30 bg-[#007AFF]/10 text-[#007AFF] shadow-sm'
              )}
            >
              480p
            </button>
          </div>
        </div>

        <TooltipProvider>
          <div className="space-y-4 rounded-xl bg-white/[0.03] p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="h-3.5 w-3.5 text-white/40" />
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Advanced
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Seed
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/20 hover:text-white/40 cursor-help" />
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
                className="input-glass h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Init Image URL
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/20 hover:text-white/40 cursor-help" />
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
                  className="input-glass h-8 text-xs flex-1"
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
                  size="sm"
                  className="h-8 px-2 border-white/10 bg-white/5 hover:bg-white/10 text-white/60"
                >
                  <Upload className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Aspect Ratio
                </Label>
              </div>
              <div className="flex flex-wrap gap-1.5">
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
                        "rounded-md border px-2 py-1 text-[10px] font-medium transition-colors",
                        aspectRatio === ratio
                          ? "border-[#007AFF]/30 bg-[#007AFF]/10 text-[#007AFF]"
                          : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60",
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
                <Label className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Camera Fixed
                </Label>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !cameraFixed;
                  setCameraFixed(next);
                  updateAdvancedField({ camera_fixed: next });
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors w-full justify-center",
                  cameraFixed
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10",
                )}
              >
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  cameraFixed ? "bg-emerald-400" : "bg-white/20"
                )} />
                {cameraFixed ? "Fixed Camera" : "Free Camera"}
              </button>
            </div>
          </div>
        </TooltipProvider>

        {clip.status !== 'ready' && (
          <Button
            onClick={() => onGenerateClip(clip.id)}
            disabled={!canGenerate}
            className="w-full btn-primary h-10 rounded-xl"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 fill-current" />
                Generate Clip
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
