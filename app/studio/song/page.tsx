'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Sparkles, Disc, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SongStudioPage() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate generation
        setTimeout(() => setIsGenerating(false), 5000);
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
                        <Music className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        Song Creator
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Compose full songs with lyrics and melody using AI.
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
                                    <Label className="label-glass">Song Description</Label>
                                    <textarea
                                        className="input-glass min-h-[120px] w-full resize-none"
                                        placeholder="A happy pop song about summer..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="label-glass">Genre</Label>
                                    <Select defaultValue="pop">
                                        <SelectTrigger className="input-glass">
                                            <SelectValue placeholder="Select genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pop">Pop</SelectItem>
                                            <SelectItem value="rock">Rock</SelectItem>
                                            <SelectItem value="hiphop">Hip Hop</SelectItem>
                                            <SelectItem value="electronic">Electronic</SelectItem>
                                            <SelectItem value="jazz">Jazz</SelectItem>
                                            <SelectItem value="classical">Classical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="label-glass">Duration</Label>
                                    <Select defaultValue="30s">
                                        <SelectTrigger className="input-glass">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30s">30 Seconds</SelectItem>
                                            <SelectItem value="1m">1 Minute</SelectItem>
                                            <SelectItem value="2m">2 Minutes</SelectItem>
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
                                        Composing...
                                    </>
                                ) : (
                                    <>
                                        <Disc className="mr-2 h-4 w-4" />
                                        Generate Song
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
                                            <Music className="h-10 w-10 animate-bounce" />
                                        </div>
                                    </div>
                                    <p className="text-lg font-medium text-[#1d1d1f] animate-pulse">
                                        Composing melody & lyrics...
                                    </p>
                                </div>
                            ) : (
                                <div className="max-w-md space-y-4">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/5 text-black/20">
                                        <PlayCircle className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1d1d1f]">
                                        No Song Generated
                                    </h3>
                                    <p className="text-black/50">
                                        Enter a description to start composing your original song.
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
