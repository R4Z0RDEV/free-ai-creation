'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { PageHero } from "@/components/Layout/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Upload, Maximize, Info } from "lucide-react";
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

export default function UpscaleStudio() {
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
      toast.success('워터마크 없는 업스케일을 사용할 수 있습니다.');
    } finally {
      setIsUnlockingClean(false);
    }
  };

  const upscaledImage = getDisplayedUrl(upscaleResult);

  return (
    <AppShell>
      <PageHero
        eyebrow="AI UPSCALING"
        title="Enhance your images in one click."
        description="Sharpen details, remove blur, and upscale your images with AI — perfect for thumbnails, product shots, and social posts."
      >
        <p className="mt-3 text-xs text-white/60">
          Upscale model: Real-ESRGAN on Replicate
        </p>
      </PageHero>

      <section className="relative py-10 lg:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-64 max-w-3xl -translate-y-24 rounded-full section-glow bg-[radial-gradient(circle,_rgba(196,181,253,0.4),transparent_65%)]" />

        <div className="page-container relative grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 왼쪽 설정 패널 */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="panel p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Upload
                </Label>
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
                  className="w-full justify-center rounded-2xl border-white/15 bg-white/5 text-sm font-medium text-white hover:bg-white/10"
                  disabled={isUpscaling}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>

              <TooltipProvider>
                <div className="space-y-4 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Scale
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
                          이미지를 몇 배로 키울지 선택합니다. 값이 클수록 해상도가
                          높아지지만 처리 시간이 늘어납니다.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                <Select
                      value={String(scale)}
                      onValueChange={(value) => setScale(Number(value))}
                  disabled={isUpscaling}
                >
                  <SelectTrigger className="rounded-2xl bg-white/5 border-white/10 text-sm text-white">
                    <SelectValue placeholder="Select scale" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050508] border-white/10 text-sm text-white">
                        {[2, 4, 6, 8, 10].map((s) => (
                          <SelectItem key={s} value={String(s)}>
                            {s}x
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                        Face Enhance
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
                          얼굴이 포함된 이미지에서 얼굴 디테일을 추가로 보정합니다.
                          인물 사진에 유용하지만, 모든 이미지에 필요하지는
                          않습니다.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFaceEnhance((prev) => !prev)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                        faceEnhance
                          ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100"
                          : "border-white/20 bg-white/5 text-white/70",
                      )}
                    >
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full border border-white/40",
                          faceEnhance && "border-transparent bg-emerald-400",
                        )}
                      />
                      {faceEnhance ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </TooltipProvider>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Mode
                </Label>
                <Select
                  value={mode}
                  onValueChange={setMode}
                  disabled={isUpscaling}
                >
                  <SelectTrigger className="rounded-2xl bg-white/5 border-white/10 text-sm text-white">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050508] border-white/10 text-sm text-white">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="high-detail">High Detail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpscale}
                disabled={isUpscaling || !originalImage}
                className="w-full rounded-2xl bg-gradient-to-r from-[#c4b5fd] via-[#a855f7] to-[#6366f1] text-sm font-semibold text-white shadow-[0_0_40px_rgba(148,163,255,0.4)] hover:brightness-110 transition"
              >
                {isUpscaling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upscaling...
                  </>
                ) : (
                  <>
                    <Maximize className="w-4 h-4 mr-2" />
                    Upscale Image
                  </>
                )}
              </Button>

              {upscaledImage && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full rounded-2xl border-white/15 bg-white/[0.02] text-sm text-white hover:bg-white/10"
                    disabled={isUpscaling}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Upscaled
                  </Button>
                  {upscaleResult?.cleanUrl && !upscaleResult.hasUnlockedClean && (
                    <Button
                      onClick={handleUnlockClean}
                      variant="ghost"
                      disabled={isUnlockingClean}
                      className="w-full rounded-2xl border border-purple-500/40 bg-purple-500/5 text-xs font-semibold uppercase tracking-[0.24em] text-purple-100 hover:bg-purple-500/15 disabled:opacity-50"
                    >
                      {isUnlockingClean ? "광고 시청 중..." : "광고 보고 워터마크 제거"}
                    </Button>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-white/5 text-[11px] text-[#8b8b8b] leading-relaxed">
                <p>
                  • We don&apos;t store your images — all processing is done per
                  request.
                </p>
                <p>• Best results with clear subjects and good lighting.</p>
              </div>
            </Card>
          </motion.div>

          {/* 오른쪽: 비교 패널 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-9"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <Card className="panel flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold tracking-[0.16em] text-white/70 uppercase">
                    Original
                  </h2>
                  {originalImage && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#aaaaaa]">
                      Source
                    </span>
                  )}
                </div>
                <div className="relative flex-1 rounded-2xl bg-black/40 min-h-[360px] flex items-center justify-center overflow-hidden">
                  {!originalImage ? (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#c4b5fd]/25 to-[#6366f1]/25 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-[#c4b5fd]" />
                      </div>
                      <div>
                        <p className="text-gray-200 text-base font-medium">
                          No image uploaded
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Click &quot;Choose Image&quot; to get started
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={originalImage}
                      alt="Original"
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                  )}
                </div>
              </Card>

              {/* Upscaled */}
              <Card className="panel flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold tracking-[0.16em] text-white/70 uppercase">
                    Upscaled
                  </h2>
                  {upscaledImage && (
                    <span className="rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs text-[#4ade80]">
                      Enhanced
                    </span>
                  )}
                </div>
                <div className="relative flex-1 rounded-2xl bg-black/40 min-h-[360px] flex items-center justify-center overflow-hidden">
                  {!upscaledImage && !isUpscaling && (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#c4b5fd]/25 to-[#6366f1]/25 flex items-center justify-center">
                        <Maximize className="w-10 h-10 text-[#c4b5fd]" />
                      </div>
                      <div>
                        <p className="text-gray-200 text-base font-medium">
                          No upscaled image yet
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Choose settings and click &quot;Upscale Image&quot;
                        </p>
                      </div>
                    </div>
                  )}

                  {isUpscaling && (
                    <div className="text-center space-y-4">
                      <Loader2 className="w-12 h-12 text-[#c4b5fd] animate-spin mx-auto" />
                      <p className="text-gray-300 text-sm">
                        Upscaling your image with AI...
                      </p>
                    </div>
                  )}

                  {originalImage && upscaledImage && !isUpscaling && (
                    <BeforeAfterSlider
                      beforeSrc={originalImage}
                      afterSrc={upscaledImage}
                      alt="Upscaled comparison"
                      className="h-[400px] w-full"
                    />
                  )}

                  {upscaledImage && !originalImage && !isUpscaling && (
                    <img
                      src={upscaledImage}
                      alt="Upscaled"
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
