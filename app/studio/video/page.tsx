'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Video, Sparkles, Clapperboard, Film, Play, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 4000);
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
                  <Select defaultValue="4s">
                    <SelectTrigger className="input-glass">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2s">2 Seconds</SelectItem>
                      <SelectItem value="4s">4 Seconds</SelectItem>
                      <SelectItem value="8s">8 Seconds (Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="label-glass">Motion Strength</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="input-glass">
                      <SelectValue placeholder="Select motion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Subtle</SelectItem>
                      <SelectItem value="medium">Balanced</SelectItem>
                      <SelectItem value="high">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
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
    </AppShell>
  );
}
