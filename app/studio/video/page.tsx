'use client';

import { useState } from 'react';
import { useAdblockDetector } from '@/hooks/useAdblockDetector';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Video, Sparkles, Clapperboard, Film, Play, Loader2, Download, Upload, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState('5s');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [cameraFixed, setCameraFixed] = useState(false);
  const [seed, setSeed] = useState<number | ''>('');
  const [image, setImage] = useState<string | null>(null);
  const [lastFrameImage, setLastFrameImage] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const { isBlocked: isAdBlockEnabled } = useAdblockDetector();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      toast.error('Maximum 4 reference images allowed');
      return;
    }

    const newImages: string[] = [];
    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processed++;
        if (processed === files.length) {
          setReferenceImages(prev => [...prev, ...newImages].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
  };

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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (isAdBlockEnabled) {
      toast.error('광고 차단 프로그램이 감지되었습니다. 비디오를 생성하려면 광고 차단 기능을 비활성화해주세요.', {
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    try {
      const durationNum = parseInt(duration.replace('s', ''));

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          duration: durationNum,
          resolution: '480p',
          aspect_ratio: aspectRatio,
          camera_fixed: cameraFixed,
          seed: seed === '' ? undefined : Number(seed),
          image: image || undefined,
          last_frame_image: lastFrameImage || undefined,
          reference_images: referenceImages.length > 0 ? referenceImages : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
        toast.success('Video generated successfully!');
      } else {
        throw new Error('No video URL returned');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedVideoUrl) return;
    const a = document.createElement('a');
    a.href = generatedVideoUrl;
    a.download = `ai-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <Video className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
            Video Studio
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-black/60">
            Produce cinematic videos from text descriptions with our advanced motion engine.
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
                    placeholder="Describe your video idea..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-glass min-h-[120px] resize-none text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="label-glass">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="input-glass">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2s">2 Seconds</SelectItem>
                      <SelectItem value="3s">3 Seconds</SelectItem>
                      <SelectItem value="4s">4 Seconds</SelectItem>
                      <SelectItem value="5s">5 Seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="label-glass">Resolution</Label>
                  <div className="input-glass h-10 flex items-center px-3 text-sm text-black/60">
                    480p (Fixed)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="label-glass">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="input-glass">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="label-glass">Seed (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="Random"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value === '' ? '' : Number(e.target.value))}
                      className="input-glass"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label className="label-glass cursor-pointer" htmlFor="camera-fixed">Camera Fixed</Label>
                  <Switch
                    id="camera-fixed"
                    checked={cameraFixed}
                    onCheckedChange={setCameraFixed}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5">
                  <div className="space-y-2">
                    <Label className="label-glass">Start Image (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setImage)}
                        className="hidden"
                        id="start-image-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full btn-glass"
                        onClick={() => document.getElementById('start-image-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {image ? 'Change Image' : 'Upload Start Image'}
                      </Button>
                      {image && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setImage(null)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {image && (
                      <div className="relative h-20 w-full overflow-hidden rounded-lg border border-black/10">
                        <img src={image} alt="Start" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="label-glass">Last Frame Image (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setLastFrameImage)}
                        className="hidden"
                        id="last-image-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full btn-glass"
                        onClick={() => document.getElementById('last-image-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {lastFrameImage ? 'Change Image' : 'Upload Last Frame'}
                      </Button>
                      {lastFrameImage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLastFrameImage(null)}
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {lastFrameImage && (
                      <div className="relative h-20 w-full overflow-hidden rounded-lg border border-black/10">
                        <img src={lastFrameImage} alt="Last" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="label-glass">Reference Images (Max 4)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleReferenceImagesChange}
                        className="hidden"
                        id="ref-images-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full btn-glass"
                        onClick={() => document.getElementById('ref-images-upload')?.click()}
                        disabled={referenceImages.length >= 4}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Add Reference Images
                      </Button>
                      {referenceImages.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReferenceImages([])}
                          className="text-xs text-red-500 hover:bg-red-50"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    {referenceImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {referenceImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-black/10">
                            <img src={img} alt={`Ref ${idx}`} className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Clapperboard className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <GlassCard className="flex min-h-[600px] flex-col items-center justify-center p-8 text-center">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#007AFF]/20" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                      <Film className="h-10 w-10 animate-spin" />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-[#1d1d1f] animate-pulse">
                    Rendering frames...
                  </p>
                </div>
              ) : generatedVideoUrl ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-[500px] w-full rounded-lg shadow-2xl"
                  />
                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleDownload}
                      className="btn-glass"
                      variant="secondary"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md space-y-4">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/5 text-black/20">
                    <Play className="h-10 w-10 ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    Scene Not Generated
                  </h3>
                  <p className="text-black/50">
                    Enter a prompt to start generating your cinematic video.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </AppShell >
  );
}
