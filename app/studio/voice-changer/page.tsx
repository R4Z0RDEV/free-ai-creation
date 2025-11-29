'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Upload, Mic, Music, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function VoiceChangerStudioPage() {
    const [originalFile, setOriginalFile] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<'anime' | 'robot' | 'monster' | 'custom'>('anime');
    const [pitch, setPitch] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const presets = {
        anime: { label: 'Anime Girl', pitch: 12, model: 'CUSTOM', url: 'https://huggingface.co/Argax/doofenshmirtz-RUS/resolve/main/doofenshmirtz.zip' }, // Placeholder URL, ideally need a real anime model or just use pitch
        robot: { label: 'Robot', pitch: 0, model: 'Rogan', url: '' },
        monster: { label: 'Monster', pitch: -12, model: 'CUSTOM', url: '' },
        custom: { label: 'Custom', pitch: 0, model: 'CUSTOM', url: '' },
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                toast.error('Please select an audio file');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size too large. Please use a file under 10MB.');
                return;
            }

            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalFile(e.target?.result as string);
                setResultUrl(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProcess = async () => {
        if (!originalFile) {
            toast.error('Please upload an audio file first');
            return;
        }

        setIsProcessing(true);

        // Determine settings based on preset
        let finalPitch = pitch;
        let finalModel = 'CUSTOM';
        let finalUrl = '';

        if (selectedPreset !== 'custom') {
            finalPitch = presets[selectedPreset].pitch;
            finalModel = presets[selectedPreset].model;
            finalUrl = presets[selectedPreset].url;
        }

        try {
            const response = await fetch('/api/voice-changer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio: originalFile,
                    pitch_change: finalPitch,
                    rvc_model: finalModel,
                    custom_model_url: finalUrl || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change voice');
            }

            const data = await response.json();
            if (!data.audioUrl) {
                throw new Error('No audio generated');
            }

            setResultUrl(data.audioUrl);
            toast.success('Voice changed successfully!');
        } catch (error) {
            console.error('Processing error:', error);
            toast.error('Failed to change voice');
        } finally {
            setIsProcessing(false);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
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
                        <Mic className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        AI Voice Changer
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Transform your voice into different characters using advanced RVC models.
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
                                    <Label className="label-glass">Upload Audio</Label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                        className="w-full btn-glass h-24 border-dashed border-black/10 hover:border-[#007AFF]/50 hover:bg-[#007AFF]/5 text-black/60 hover:text-[#007AFF] flex flex-col gap-2"
                                        disabled={isProcessing}
                                    >
                                        <Upload className="w-6 h-6" />
                                        <span className="text-sm">{fileName ? "Change File" : "Choose Audio File"}</span>
                                        {fileName && <span className="text-xs text-[#007AFF]">{fileName}</span>}
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <Label className="label-glass">Voice Preset</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => (
                                            <button
                                                key={key}
                                                onClick={() => setSelectedPreset(key)}
                                                className={cn(
                                                    "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                                                    selectedPreset === key
                                                        ? "bg-[#007AFF] text-white border-[#007AFF] shadow-md"
                                                        : "bg-white/50 text-black/60 border-black/5 hover:bg-white/80 hover:border-black/10"
                                                )}
                                            >
                                                {presets[key].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedPreset === 'custom' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="label-glass">Pitch Adjustment</Label>
                                            <span className="text-xs text-[#007AFF] font-medium">{pitch}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="-24"
                                            max="24"
                                            step="1"
                                            value={pitch}
                                            onChange={(e) => setPitch(Number(e.target.value))}
                                            className="w-full h-1.5 bg-black/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#007AFF]"
                                        />
                                        <p className="text-[10px] text-black/40 text-center">
                                            -12 = One Octave Down | +12 = One Octave Up
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleProcess}
                                    disabled={isProcessing || !originalFile}
                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12 mt-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Transforming...
                                        </>
                                    ) : (
                                        <>
                                            <Music className="w-4 h-4 mr-2" />
                                            Change Voice
                                        </>
                                    )}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Right Panel - Result */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-8"
                    >
                        <GlassCard className="flex flex-col p-1 h-full min-h-[400px]">
                            <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                                    <Music className="w-3.5 h-3.5" />
                                    Result Audio
                                </h2>
                                {resultUrl && (
                                    <a
                                        href={resultUrl}
                                        download="changed-voice.mp3"
                                        className="inline-flex items-center justify-center h-7 px-3 text-xs font-medium bg-white/50 hover:bg-white/80 border border-black/5 rounded-lg transition-colors"
                                    >
                                        <Download className="w-3 h-3 mr-1.5" />
                                        Download
                                    </a>
                                )}
                            </div>
                            <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden rounded-b-3xl">
                                {!resultUrl && !isProcessing && (
                                    <div className="text-center space-y-4 p-8">
                                        <div className="w-20 h-20 mx-auto rounded-full bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                                            <Mic className="w-8 h-8 text-[#007AFF]/40" />
                                        </div>
                                        <div>
                                            <p className="text-black/60 text-sm font-medium">
                                                No audio generated yet
                                            </p>
                                            <p className="text-black/40 text-xs mt-1">
                                                Upload audio and select a voice
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="text-center space-y-4">
                                        <div className="relative mx-auto h-16 w-16">
                                            <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
                                        </div>
                                        <p className="text-[#007AFF] text-sm font-medium animate-pulse">
                                            Transforming voice...
                                        </p>
                                    </div>
                                )}

                                {resultUrl && !isProcessing && (
                                    <div className="w-full max-w-md p-6 space-y-6">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={togglePlay}
                                                className="w-20 h-20 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg hover:bg-[#0066CC] transition-transform hover:scale-105 active:scale-95"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-8 h-8 fill-current" />
                                                ) : (
                                                    <Play className="w-8 h-8 fill-current ml-1" />
                                                )}
                                            </button>
                                        </div>
                                        <audio
                                            ref={audioRef}
                                            src={resultUrl}
                                            onEnded={() => setIsPlaying(false)}
                                            onPause={() => setIsPlaying(false)}
                                            onPlay={() => setIsPlaying(true)}
                                            className="w-full hidden"
                                            controls
                                        />
                                        <p className="text-center text-sm text-black/60">
                                            {isPlaying ? "Playing..." : "Click to Play"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </AppShell>
    );
}
