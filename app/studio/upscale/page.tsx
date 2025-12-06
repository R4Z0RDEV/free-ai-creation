'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Upload, Maximize, Info, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type UpscaleResult = {
  id: string;
  watermarkedUrl: string;
  cleanUrl?: string;
  hasUnlockedClean?: boolean;
};

const getDisplayedUrl = (result: UpscaleResult | null) => {
  if (!result) return null;
  if (result.hasUnlockedClean && result.cleanUrl) {
    return result.cleanUrl;
  }
  return result.watermarkedUrl;
};

export default function UpscaleStudioPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [upscaleResult, setUpscaleResult] = useState<UpscaleResult | null>(null);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isUnlockingClean, setIsUnlockingClean] = useState(false);
  const [scale, setScale] = useState(4);
  const [mode, setMode] = useState("standard");
  const [faceEnhance, setFaceEnhance] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setUpscaleResult(null);
        setIsUnlockingClean(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = async () => {
    if (!originalImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsUpscaling(true);
    setIsUnlockingClean(false);

    try {
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: originalImage,
          scale,
          mode,
          face_enhance: faceEnhance,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upscale image');
      }

      const data = await response.json();
      const result: UpscaleResult = {
        id: data.id,
        watermarkedUrl: data.watermarkedUrl ?? data.imageUrl ?? '',
        cleanUrl: data.originalUrl ?? '',
        hasUnlockedClean: false,
      };
      setUpscaleResult(result);
      setIsUnlockingClean(false);
      toast.success('Image upscaled successfully!');
    } catch (error) {
      console.error('Upscaling error:', error);
      toast.error('Failed to upscale image');
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleDownload = () => {
    const url = getDisplayedUrl(upscaleResult);
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `upscaled-${scale}x-${Date.now()}.png`;
    a.click();
  };

  const handleUnlockClean = async () => {
    if (!upscaleResult || upscaleResult.hasUnlockedClean || !upscaleResult.cleanUrl) {
      return;
    }
    setIsUnlockingClean(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUpscaleResult((prev) =>
        prev
          ? {
            ...prev,
            hasUnlockedClean: true,
          }
          : prev,
      );
      toast.success('Watermark removed successfully.');
    } finally {
      setIsUnlockingClean(false);
    }
  };

  const upscaledImage = getDisplayedUrl(upscaleResult);

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
            <Maximize className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            AI Image Upscaler
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            Enhance resolution, sharpen details, and remove noise with advanced AI upscaling.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <GlassCard className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="label-glass">Upload Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full btn-glass h-12 border-dashed border-black/10 hover:border-[#007AFF]/50 hover:bg-[#007AFF]/5 text-black/60 hover:text-[#007AFF]"
                    disabled={isUpscaling}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {originalImage ? "Change Image" : "Choose Image"}
                  </Button>
                </div>

                <TooltipProvider>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="label-glass">Scale Factor</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-black/40 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Higher values increase resolution but take longer.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={String(scale)}
                        onValueChange={(value) => setScale(Number(value))}
                        disabled={isUpscaling}
                      >
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder="Select scale" />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 4, 6, 8, 10].map((s) => (
                            <SelectItem key={s} value={String(s)}>
                              {s}x Upscale
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="label-glass">Face Enhance</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-black/40 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enhances facial details. Recommended for portraits.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFaceEnhance((prev) => !prev)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                          faceEnhance
                            ? "border-[#007AFF]/50 bg-[#007AFF]/10 text-[#007AFF]"
                            : "border-black/5 bg-white/40 text-black/60 hover:bg-white/60"
                        )}
                      >
                        <span>Enhance Faces</span>
                        <div className={cn(
                          "h-5 w-9 rounded-full p-0.5 transition-colors",
                          faceEnhance ? "bg-[#007AFF]" : "bg-black/10"
                        )}>
                          <div className={cn(
                            "h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                            faceEnhance ? "translate-x-4" : "translate-x-0"
                          )} />
                        </div>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <Label className="label-glass">Mode</Label>
                      <Select
                        value={mode}
                        onValueChange={setMode}
                        disabled={isUpscaling}
                      >
                        <SelectTrigger className="input-glass">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="high-detail">High Detail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TooltipProvider>
              </div>

              <Button
                onClick={handleUpscale}
                disabled={isUpscaling || !originalImage}
                className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12"
              >
                {isUpscaling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upscaling...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Upscale Image
                  </>
                )}
              </Button>

              {upscaledImage && (
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-[#007AFF] text-white hover:bg-[#0056b3] border-none shadow-md h-10"
                    disabled={isUpscaling}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Result
                  </Button>
                  {upscaleResult?.cleanUrl && !upscaleResult.hasUnlockedClean && (
                    <Button
                      onClick={handleUnlockClean}
                      variant="ghost"
                      disabled={isUnlockingClean}
                      className="w-full rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 text-[10px] font-bold uppercase tracking-widest text-[#007AFF] hover:bg-[#007AFF]/10 disabled:opacity-50 h-9"
                    >
                      {isUnlockingClean ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Unlocking...
                        </>
                      ) : (
                        "Remove Watermark"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Original */}
              <GlassCard className="flex flex-col p-1 h-full min-h-[500px]">
                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                  <h2 className="text-xs font-bold tracking-[0.2em] text-black/70 uppercase flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    Original
                  </h2>
                  {originalImage && (
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-medium text-black/60 border border-black/5">
                      Source
                    </span>
                  )}
                </div>
                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden rounded-b-3xl">
                  {!originalImage ? (
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/50 border border-white/60 flex items-center justify-center shadow-sm">
                        <Upload className="w-8 h-8 text-black/20" />
                      </div>
                      <div>
                        <p className="text-black/60 text-sm font-medium">
                          No image uploaded
                        </p>
                        <p className="text-black/40 text-xs mt-1">
                          Upload an image to start upscaling
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={originalImage}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </GlassCard>

              {/* Upscaled */}
              <GlassCard className="flex flex-col p-1 h-full min-h-[500px] ring-1 ring-[#007AFF]/20 shadow-lg shadow-[#007AFF]/5">
                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                  <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                    <Maximize className="w-3.5 h-3.5" />
                    Upscaled Result
                  </h2>
                  {upscaledImage && (
                    <span className="rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#007AFF] border border-[#007AFF]/20">
                      {scale}x Enhanced
                    </span>
                  )}
                </div>
                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden rounded-b-3xl">
                  {!upscaledImage && !isUpscaling && (
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[#007AFF]/40" />
                      </div>
                      <div>
                        <p className="text-black/60 text-sm font-medium">
                          Ready to enhance
                        </p>
                        <p className="text-black/40 text-xs mt-1">
                          Configure settings and click Upscale
                        </p>
                      </div>
                    </div>
                  )}

                  {isUpscaling && (
                    <div className="text-center space-y-4">
                      <div className="relative mx-auto h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
                      </div>
                      <p className="text-[#007AFF] text-sm font-medium animate-pulse">
                        Enhancing details...
                      </p>
                    </div>
                  )}

                  {originalImage && upscaledImage && !isUpscaling && (
                    <BeforeAfterSlider
                      beforeSrc={originalImage}
                      afterSrc={upscaledImage}
                      alt="Upscaled comparison"
                      className="h-full w-full absolute inset-0"
                    />
                  )}

                  {upscaledImage && !originalImage && !isUpscaling && (
                    <img
                      src={upscaledImage}
                      alt="Upscaled"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
