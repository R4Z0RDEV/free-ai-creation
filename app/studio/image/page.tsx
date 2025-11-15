'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { PageHero } from "@/components/Layout/PageHero";
import { Card } from "@/components/ui/card";
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
import { Loader2, Download, Image as ImageIcon, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState('1024x1024');
  const [style, setStyle] = useState('photo');
  const [history, setHistory] = useState<
    Array<{ url: string; prompt: string }>
  >([]);
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
  const [scheduler, setScheduler] = useState('K_EULER');
  const [numOutputs, setNumOutputs] = useState<number | ''>(1);
  const [guidanceScale, setGuidanceScale] = useState<number | ''>(7.5);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [numInferenceSteps, setNumInferenceSteps] = useState<number | ''>(50);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          // keep resolution in sync with current width/height for clarity
          resolution:
            typeof width === 'number' && typeof height === 'number'
              ? `${width}x${height}`
              : resolution,
          style,
          seed,
          width,
          height,
          scheduler,
          num_outputs: numOutputs,
          guidance_scale: guidanceScale,
          negative_prompt: negativePrompt,
          num_inference_steps: numInferenceSteps,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setHistory((prev) => [
        { url: data.imageUrl, prompt },
        ...prev.slice(0, 9),
      ]);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `ai-image-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <AppShell>
      <PageHero
        eyebrow="AI IMAGE STUDIO"
        title="Create images with Free AI Creation."
        description="Generate high-quality images in different styles — photoreal, illustration, anime and more. Completely free and ad-supported, no login required."
      >
        <p className="mt-3 text-xs text-white/60">
          Image model: Stable Diffusion on Replicate
        </p>
      </PageHero>

      <section className="relative py-10 lg:py-12">
        <div className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-72 max-w-4xl section-glow bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),transparent_65%)]" />
        <div className="page-container relative space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1.2fr)_minmax(0,260px)]">
            {/* 왼쪽 – 프롬프트 / 옵션 */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="panel p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold tracking-[0.25em] text-slate-300 uppercase">
                    Prompt
                  </Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[140px] resize-none border border-white/5 bg-black/40 text-sm text-white placeholder:text-slate-500"
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold tracking-[0.25em] text-slate-300 uppercase">
                    Resolution
                  </Label>
                  <Select
                    value={resolution}
                    onValueChange={(value) => {
                      setResolution(value);
                      const preset = resolutionPresets[value];
                      if (preset) {
                        setWidth(preset.width);
                        setHeight(preset.height);
                      }
                    }}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="h-9 border border-white/5 bg-black/40 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-40 rounded-2xl border border-white/10 bg-black/95 px-1 py-1 text-xs text-white shadow-xl">
                      <SelectItem value="512x512">512 × 512</SelectItem>
                      <SelectItem value="768x768">768 × 768</SelectItem>
                      <SelectItem value="1024x1024">1024 × 1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-semibold tracking-[0.25em] text-slate-300 uppercase">
                    Style
                  </Label>

                  {/* 2×2 스타일 셀렉터 – 업스케일 UI랑 느낌 맞추기 */}
                  <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                    {[
                      { id: 'photo', label: 'Photo' },
                      { id: 'illustration', label: 'Illustration' },
                      { id: 'anime', label: 'Anime' },
                      { id: 'painting', label: 'Painting' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setStyle(option.id)}
                        disabled={isGenerating}
                        className={`h-10 rounded-full border text-xs transition-all ${
                          style === option.id
                            ? 'border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_0_22px_rgba(139,92,246,0.8)]'
                            : 'border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/70'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-sm font-medium text-white shadow-[0_0_30px_rgba(139,92,246,0.8)] hover:shadow-[0_0_40px_rgba(139,92,246,1)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                <p className="mt-1 text-[11px] text-slate-500">
                  Completely free to use · Ad-supported · No login required
                </p>

                <TooltipProvider>
                  <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/55">
                      Advanced settings
                    </p>

                    {/* Seed */}
                    <div className="space-y-1">
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
                            랜덤 시드입니다. 같은 시드를 사용하면 비슷한 이미지를
                            다시 생성할 수 있습니다. 비워 두면 매번 다른 결과가
                            나옵니다.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <input
                        type="number"
                        placeholder="Random"
                        value={seed}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setSeed('');
                            return;
                          }
                          const parsed = Number(value);
                          if (!Number.isNaN(parsed)) setSeed(parsed);
                        }}
                        className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    {/* Width / Height */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            Width
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
                              생성 이미지의 가로 픽셀 수입니다. 64의 배수여야
                              합니다. 값이 클수록 더 선명하지만 느려집니다.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <input
                          type="number"
                          min={512}
                          max={1536}
                          step={64}
                          value={width}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setWidth('');
                              return;
                            }
                            const parsed = Number(value);
                            if (!Number.isNaN(parsed)) setWidth(parsed);
                          }}
                          className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            Height
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
                              생성 이미지의 세로 픽셀 수입니다. 64의 배수여야
                              합니다.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <input
                          type="number"
                          min={512}
                          max={1536}
                          step={64}
                          value={height}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setHeight('');
                              return;
                            }
                            const parsed = Number(value);
                            if (!Number.isNaN(parsed)) setHeight(parsed);
                          }}
                          className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Scheduler */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Scheduler
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
                            샘플링 방식입니다. 보통 기본값이면 충분하지만, 다른
                            스케줄러를 선택하면 이미지 느낌이 약간 달라질 수
                            있습니다.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select
                        value={scheduler}
                        onValueChange={setScheduler}
                        disabled={isGenerating}
                      >
                        <SelectTrigger className="mt-1 h-8 border border-white/10 bg-white/[0.03] text-xs text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DPMSolverMultistep">
                            DPMSolverMultistep
                          </SelectItem>
                          <SelectItem value="K_EULER">K_EULER</SelectItem>
                          <SelectItem value="K_EULER_ANCESTRAL">
                            K_EULER_ANCESTRAL
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Num outputs */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Number of Outputs
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
                            한 번에 생성할 이미지 개수입니다. 여러 장을 생성하면
                            비용과 시간이 늘어납니다.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <input
                        type="number"
                        min={1}
                        max={4}
                        value={numOutputs}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setNumOutputs('');
                            return;
                          }
                          const parsed = Number(value);
                          if (!Number.isNaN(parsed)) setNumOutputs(parsed);
                        }}
                        className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    {/* Guidance scale */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Guidance Scale
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
                            프롬프트를 얼마나 강하게 따를지 조절합니다. 값이
                            높을수록 프롬프트에 맞지만, 너무 높으면 어색한 결과가
                            나올 수 있습니다.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <input
                        type="number"
                        step={0.5}
                        min={1}
                        max={20}
                        value={guidanceScale}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setGuidanceScale('');
                            return;
                          }
                          const parsed = Number(value);
                          if (!Number.isNaN(parsed)) setGuidanceScale(parsed);
                        }}
                        className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    {/* Steps */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Steps
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
                            디노이징 반복 횟수입니다. 값이 높을수록 디테일이
                            좋아지지만 생성 시간이 증가합니다.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={numInferenceSteps}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setNumInferenceSteps('');
                            return;
                          }
                          const parsed = Number(value);
                          if (!Number.isNaN(parsed))
                            setNumInferenceSteps(parsed);
                        }}
                        className="mt-1 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    {/* Negative prompt */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                          Negative Prompt
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
                            이미지에 나오지 않았으면 하는 요소를 작성합니다. 예:
                            “low quality, artifacts, text, watermark”.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea
                        rows={3}
                        value={negativePrompt}
                        onChange={(e) =>
                          setNegativePrompt(e.target.value)
                        }
                        className="mt-1 border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-white/30 focus:border-white/40"
                        placeholder='예: "low quality, artifacts, text, watermark"'
                      />
                    </div>
                  </div>
                </TooltipProvider>
              </Card>
            </motion.div>

            {/* 가운데 – 프리뷰 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Card className="panel flex min-h-[420px] flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-300 uppercase">
                      Preview
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Latest generated image appears here.
                    </p>
                  </div>
                  {generatedImage && (
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      variant="outline"
                      className="rounded-full border-white/20 bg-white/5 text-xs text-slate-100 hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Download
                    </Button>
                  )}
                </div>

                <div className="flex flex-1 items-center justify-center rounded-2xl bg-black/40">
                  {!generatedImage && !isGenerating && (
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25">
                        <ImageIcon className="h-10 w-10 text-violet-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          No image generated yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Enter a prompt on the left and click
                          <span className="ml-1 font-medium text-violet-300">
                            Generate Image
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="space-y-4 text-center">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-violet-300" />
                      <p className="text-sm text-slate-200">
                        Generating your image…
                      </p>
                    </div>
                  )}

                  {generatedImage && !isGenerating && (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-h-[340px] max-w-full rounded-2xl object-contain"
                    />
                  )}
                </div>
              </Card>
            </motion.div>

            {/* 오른쪽 – 히스토리 */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card className="panel h-full p-6">
                <div className="mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-300 uppercase">
                    History
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Click a thumbnail to bring it back to preview.
                  </p>
                </div>

                <div className="space-y-3 overflow-y-auto pr-1 max-h-[420px]">
                  {history.length === 0 ? (
                    <p className="py-10 text-center text-xs text-slate-500">
                      No history yet. Generated images will appear here.
                    </p>
                  ) : (
                    history.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setGeneratedImage(item.url)}
                        className="group w-full text-left"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/8 bg-black/40 group-hover:border-violet-400/70 transition-colors">
                          <img
                            src={item.url}
                            alt={item.prompt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-400 group-hover:text-slate-200">
                          {item.prompt}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
