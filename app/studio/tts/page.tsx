'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/Layout/AppShell';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, Download, Info, Sparkles, Play, Pause, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type GeneratedTTS = {
    id: string;
    prompt: string;
    createdAt: string;
    audioUrl: string;
};

export default function TTSStudioPage() {
    const [text, setText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [language, setLanguage] = useState('EN');
    const [speaker, setSpeaker] = useState('EN-US');
    const [history, setHistory] = useState<GeneratedTTS[]>([]);
    const [currentTTS, setCurrentTTS] = useState<GeneratedTTS | null>(null);

    const handleGenerate = async () => {
        if (!text.trim()) {
            toast.error('Please enter text');
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    speed,
                    language,
                    speaker,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate speech');
            }

            const data = await response.json();
            const newTTS: GeneratedTTS = {
                id: data.id,
                prompt: text,
                createdAt: data.createdAt ?? new Date().toISOString(),
                audioUrl: data.audioUrl,
            };
            setHistory((prev) => [newTTS, ...prev]);
            setCurrentTTS(newTTS);
            toast.success('Speech generated successfully!');
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate speech');
        } finally {
            setIsGenerating(false);
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
                        <Volume2 className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        AI Text to Speech
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Convert text into natural-sounding speech with lifelike voices.
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
                                    <Label className="label-glass">Text to Speak</Label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter the text you want to convert to speech..."
                                        className="input-glass min-h-[140px] w-full resize-none"
                                        disabled={isGenerating}
                                    />
                                </div>

                                <TooltipProvider>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="label-glass">Language</Label>
                                            <Select value={language} onValueChange={setLanguage} disabled={isGenerating}>
                                                <SelectTrigger className="input-glass">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="EN">English</SelectItem>
                                                    <SelectItem value="ES">Spanish</SelectItem>
                                                    <SelectItem value="FR">French</SelectItem>
                                                    <SelectItem value="ZH">Chinese</SelectItem>
                                                    <SelectItem value="JP">Japanese</SelectItem>
                                                    <SelectItem value="KR">Korean</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="label-glass">Speaker (Accent)</Label>
                                            <Select value={speaker} onValueChange={setSpeaker} disabled={isGenerating}>
                                                <SelectTrigger className="input-glass">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="EN-US">US English</SelectItem>
                                                    <SelectItem value="EN-BR">British English</SelectItem>
                                                    <SelectItem value="EN_INDIA">Indian English</SelectItem>
                                                    <SelectItem value="EN-AU">Australian English</SelectItem>
                                                    <SelectItem value="EN-Default">Default English</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <Label className="label-glass">Speed</Label>
                                                <span className="text-xs text-[#007AFF] font-mono bg-[#007AFF]/10 px-2 py-0.5 rounded border border-[#007AFF]/20">{speed}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2.0"
                                                step="0.1"
                                                value={speed}
                                                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                                className="w-full h-1.5 rounded-full bg-black/10 accent-[#007AFF] cursor-pointer"
                                                disabled={isGenerating}
                                            />
                                        </div>
                                    </div>
                                </TooltipProvider>

                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !text.trim()}
                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-4 h-4 mr-2" />
                                            Generate Speech
                                        </>
                                    )}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Right Panel - Output & History */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Output */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <GlassCard className="flex min-h-[300px] flex-col p-1 ring-1 ring-[#007AFF]/20 shadow-lg shadow-[#007AFF]/5">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                                        <Volume2 className="w-3.5 h-3.5" />
                                        Output
                                    </h2>
                                    {currentTTS && (
                                        <span className="rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#007AFF] border border-[#007AFF]/20">
                                            Ready
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 items-center justify-center rounded-b-3xl bg-black/5 p-8">
                                    {!currentTTS && !isGenerating && (
                                        <div className="text-center space-y-4">
                                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/50 border border-white/60 shadow-sm">
                                                <Mic className="h-8 w-8 text-black/20" />
                                            </div>
                                            <div>
                                                <p className="text-black/60 text-sm font-medium">
                                                    No speech generated yet
                                                </p>
                                                <p className="text-black/40 text-xs mt-1">
                                                    Enter text to start generating
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {isGenerating && (
                                        <div className="space-y-4 text-center">
                                            <div className="relative mx-auto h-16 w-16">
                                                <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                                                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
                                            </div>
                                            <p className="text-[#007AFF] text-sm font-medium animate-pulse">
                                                Generating speech...
                                            </p>
                                        </div>
                                    )}

                                    {currentTTS && !isGenerating && (
                                        <div className="w-full max-w-md space-y-8 text-center">
                                            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#007AFF]/10 shadow-[0_0_60px_rgba(0,122,255,0.1)] animate-pulse-slow">
                                                <Volume2 className="h-12 w-12 text-[#007AFF]" />
                                            </div>

                                            <div className="bg-white/60 rounded-2xl p-4 border border-white/60 shadow-sm">
                                                <audio controls className="w-full accent-[#007AFF]" src={currentTTS.audioUrl} />
                                            </div>

                                            <Button
                                                onClick={() => {
                                                    const a = document.createElement('a');
                                                    a.href = currentTTS.audioUrl;
                                                    a.download = `tts-${currentTTS.id}.mp3`;
                                                    a.click();
                                                }}
                                                className="bg-[#007AFF] text-white hover:bg-[#0056b3] border-none shadow-md rounded-xl px-6 py-5 text-xs font-semibold uppercase tracking-wider"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Speech
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* History */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <GlassCard className="p-1">
                                <div className="px-5 py-4 border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-black/60 uppercase">
                                        History
                                    </h2>
                                </div>
                                <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {history.length === 0 ? (
                                        <p className="py-8 text-center text-xs text-black/30 italic">
                                            No history yet.
                                        </p>
                                    ) : (
                                        history.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setCurrentTTS(item)}
                                                className={cn(
                                                    "w-full rounded-xl border p-4 text-left transition-all group",
                                                    currentTTS?.id === item.id
                                                        ? "border-[#007AFF]/50 bg-[#007AFF]/5 shadow-sm"
                                                        : "border-black/5 bg-white/40 hover:bg-white/60 hover:border-black/10"
                                                )}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={cn(
                                                            "line-clamp-1 text-xs font-medium mb-1",
                                                            currentTTS?.id === item.id ? "text-[#007AFF]" : "text-black/80 group-hover:text-black"
                                                        )}>
                                                            {item.prompt}
                                                        </p>
                                                        <p className="text-[10px] text-black/40">
                                                            {new Date(item.createdAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                                        currentTTS?.id === item.id ? "bg-[#007AFF] text-white" : "bg-black/5 text-black/40 group-hover:bg-black/10 group-hover:text-black"
                                                    )}>
                                                        {currentTTS?.id === item.id ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
