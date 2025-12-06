'use client';

import { useState } from 'react';
import { useAdblockDetector } from '@/hooks/useAdblockDetector';
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Image as ImageIcon, Info, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WatermarkedPreview } from "@/components/ui/WatermarkedPreview";

type GeneratedImage = {
  id: string;
  prompt: string;
  createdAt: string;
  originalUrl: string;
  watermarkedUrl: string;
  cleanUrl?: string;
  hasUnlockedClean?: boolean;
};

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL ??
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'https://free-ai-creation.com');

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolution, setResolution] = useState('1024x1024');
  const [style, setStyle] = useState('photo');
  const [seed, setSeed] = useState<number | ''>('');

  // Resolution presets map to concrete width/height, width/height are the source of truth.
  const resolutionPresets: Record<string, { width: number; height: number }> = {
    '512x512': { width: 512, height: 512 },
    '768x768': { width: 768, height: 768 },
    '1024x1024': { width: 1024, height: 1024 },
  };

  const initialPreset = resolutionPresets[resolution] ?? resolutionPresets['1024x1024'];
  const [width, setWidth] = useState<number | ''>(initialPreset.width);
  const [height, setHeight] = useState<number | ''>(initialPreset.height);
  const [guidanceScale, setGuidanceScale] = useState<number | ''>(0);
  const [numInferenceSteps, setNumInferenceSteps] = useState<number | ''>(8);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [unlockingImageId, setUnlockingImageId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { isBlocked: isAdBlockEnabled, isChecking: isCheckingAdBlock } = useAdblockDetector();

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to enhance prompt');

      const data = await response.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        toast.success('Prompt enhanced!');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const getDisplayedUrl = (image?: GeneratedImage) => {
    if (!image) return '';
    if (image.hasUnlockedClean && image.cleanUrl) {
      return image.cleanUrl;
    }
    return image.watermarkedUrl;
  };

  const currentImage =
    history.find((item) => item.id === selectedImageId) ?? history[0] ?? null;
  const displayedCurrentUrl = getDisplayedUrl(currentImage);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (isAdBlockEnabled) {
      toast.error('광고 차단 프로그램이 감지되었습니다. 이미지를 생성하려면 광고 차단 기능을 비활성화해주세요.', {
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          resolution:
            typeof width === 'number' && typeof height === 'number'
              ? `${width}x${height}`
              : resolution,
          style,
          seed,
          width,
          height,
          guidance_scale: guidanceScale,
          num_inference_steps: numInferenceSteps,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const newImage: GeneratedImage = {
        id: data.id,
        prompt,
        createdAt: data.createdAt ?? new Date().toISOString(),
        originalUrl: data.originalUrl ?? '',
        watermarkedUrl: data.watermarkedUrl ?? '',
        cleanUrl: data.originalUrl ?? '',
        hasUnlockedClean: false,
      };
      setHistory((prev) => {
        const next = [newImage, ...prev];
        return next.slice(0, 10);
      });
      setSelectedImageId(newImage.id);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWithGate = () => {
    if (!currentImage) return;
    const url = getDisplayedUrl(currentImage);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-image-${currentImage.id}.png`;
    a.click();
  };

  const handleUnlockWatermark = async () => {
    if (!currentImage || currentImage.hasUnlockedClean) return;
    setUnlockingImageId(currentImage.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setHistory((prev) =>
        prev.map((image) =>
          image.id === currentImage.id
            ? {
              ...image,
              hasUnlockedClean: true,
              cleanUrl: image.cleanUrl ?? image.originalUrl,
            }
            : image,
        ),
      );
    } finally {
      setUnlockingImageId(null);
    }
  };

  return (
    <AppShell>
      <div className="page-container pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/50 text-[#007AFF] ring-1 ring-black/5 shadow-sm backdrop-blur-md">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            AI Image Studio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            Create stunning visuals with professional-grade AI models.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Panel - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <GlassCard className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="label-glass">Prompt</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className="h-6 px-2 text-xs text-[#007AFF] hover:text-[#0066CC] hover:bg-[#007AFF]/10"
                    >
                      {isEnhancing ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="mr-1 h-3 w-3" />
                      )}
                      Enhance
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Describe your imagination..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-glass min-h-[120px] resize-none text-base"
                  />
                </div>



                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="label-glass">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="input-glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="photo">Photorealistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="digital-art">Digital Art</SelectItem>
                        <SelectItem value="oil-painting">Oil Painting</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="label-glass">Resolution</Label>
                    <Select
                      value={resolution}
                      onValueChange={(val) => {
                        setResolution(val);
                        const preset = resolutionPresets[val];
                        if (preset) {
                          setWidth(preset.width);
                          setHeight(preset.height);
                        }
                      }}
                    >
                      <SelectTrigger className="input-glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024">Square (1:1)</SelectItem>
                        <SelectItem value="768x768">Portrait (3:4)</SelectItem>
                        <SelectItem value="512x512">Landscape (4:3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TooltipProvider>
                  <div className="space-y-4 pt-4 border-t border-black/5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="label-glass flex items-center gap-2">
                          Guidance Scale
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-black/40" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How closely to follow the prompt</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-xs text-[#007AFF] font-medium">{guidanceScale}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={guidanceScale}
                        onChange={(e) => setGuidanceScale(Number(e.target.value))}
                        className="w-full h-1.5 bg-black/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#007AFF]"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="label-glass flex items-center gap-2">
                          Steps
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-black/40" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>More steps = higher quality but slower</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-xs text-[#007AFF] font-medium">{numInferenceSteps}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={numInferenceSteps}
                        onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                        className="w-full h-1.5 bg-black/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#007AFF]"
                      />
                    </div>
                  </div>
                </TooltipProvider>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12 mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Center Panel - Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <GlassCard className="flex min-h-[600px] flex-col p-6 h-full">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#1d1d1f]">Preview</h3>
                </div>
                {currentImage && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDownloadWithGate}
                      size="sm"
                      variant="secondary"
                      className="h-8 text-xs btn-glass"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download
                    </Button>
                    {currentImage.cleanUrl && !currentImage.hasUnlockedClean && (
                      <Button
                        onClick={handleUnlockWatermark}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-[#007AFF] hover:text-[#007AFF]/80 hover:bg-[#007AFF]/5"
                      >
                        {unlockingImageId === currentImage.id ? "Unlocking..." : "Remove Watermark"}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-1 items-center justify-center rounded-2xl border border-black/5 bg-black/5 overflow-hidden relative group">
                {!currentImage && !isGenerating && (
                  <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/50 ring-1 ring-black/5 shadow-sm">
                      <ImageIcon className="h-8 w-8 text-black/20" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black/60">No image generated yet</p>
                      <p className="text-xs text-black/40 mt-1">Enter a prompt and click Generate</p>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto h-12 w-12">
                      <Loader2 className="h-12 w-12 animate-spin text-[#007AFF]" />
                    </div>
                    <p className="text-sm font-medium text-black/60 animate-pulse">Creating masterpiece...</p>
                  </div>
                )}

                {currentImage && !isGenerating && (
                  <WatermarkedPreview hasWatermark={false}>
                    <img
                      src={displayedCurrentUrl}
                      alt="Generated"
                      className="max-h-[550px] w-full object-contain shadow-2xl"
                    />
                  </WatermarkedPreview>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Panel - History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <GlassCard className="h-full p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#1d1d1f]">History</h3>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 max-h-[600px] custom-scrollbar">
                {history.length === 0 ? (
                  <p className="py-10 text-center text-xs text-black/30">
                    No history yet
                  </p>
                ) : (
                  history.map((item) => {
                    const displayedHistoryUrl = getDisplayedUrl(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedImageId(item.id)}
                        className={`group w-full text-left transition-all duration-200 ${selectedImageId === item.id ? 'opacity-100 scale-[1.02]' : 'opacity-60 hover:opacity-100'
                          }`}
                      >
                        <div className={`aspect-square overflow-hidden rounded-xl border bg-black/5 transition-all ${selectedImageId === item.id
                          ? 'border-[#007AFF] shadow-md ring-2 ring-[#007AFF]/20'
                          : 'border-black/5 group-hover:border-black/10'
                          }`}>
                          <img
                            src={displayedHistoryUrl}
                            alt={item.prompt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
