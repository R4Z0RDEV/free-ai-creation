'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Upload, FileText, Captions } from "lucide-react";
import { toast } from "sonner";

export default function SubtitlesStudioPage() {
    const [originalFile, setOriginalFile] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
                toast.error('Please select a video or audio file');
                return;
            }

            // Limit file size to 10MB for this demo to avoid browser freeze on base64 conversion
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size too large. Please use a file under 10MB.');
                return;
            }

            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalFile(e.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateSubtitles = async () => {
        if (!originalFile) {
            toast.error('Please upload a file first');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/subtitles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audio: originalFile,
                    format: 'srt'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate subtitles');
            }

            const data = await response.json();
            // Replicate Whisper output might be the string directly or nested
            const srtContent = typeof data.output === 'string' ? data.output : data.output.transcription || data.output.srt;

            if (!srtContent) {
                throw new Error('No subtitles generated');
            }

            setResult(srtContent);
            toast.success('Subtitles generated successfully!');
        } catch (error) {
            console.error('Processing error:', error);
            toast.error('Failed to generate subtitles');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subtitles-${Date.now()}.srt`;
        a.click();
        URL.revokeObjectURL(url);
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
                        <Captions className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        AI Auto Subtitles
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Automatically generate accurate SRT subtitles for your videos using advanced speech recognition.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Panel - Upload & Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        <GlassCard className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="label-glass">Upload Media</Label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*,audio/*"
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
                                        <span className="text-sm">{fileName ? "Change File" : "Choose Video/Audio"}</span>
                                        {fileName && <span className="text-xs text-[#007AFF]">{fileName}</span>}
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleGenerateSubtitles}
                                    disabled={isProcessing || !originalFile}
                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Transcribing...
                                        </>
                                    ) : (
                                        <>
                                            <Captions className="w-4 h-4 mr-2" />
                                            Generate Subtitles
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
                        <GlassCard className="flex flex-col p-1 h-full min-h-[500px]">
                            <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" />
                                    Generated Subtitles (SRT)
                                </h2>
                                {result && (
                                    <Button
                                        onClick={handleDownload}
                                        size="sm"
                                        className="h-7 text-xs bg-[#007AFF] text-white hover:bg-[#0056b3] border-none shadow-md"
                                    >
                                        <Download className="w-3 h-3 mr-1.5" />
                                        Download SRT
                                    </Button>
                                )}
                            </div>
                            <div className="relative flex-1 bg-black/5 overflow-hidden rounded-b-3xl">
                                {!result && !isProcessing && (
                                    <div className="flex h-full items-center justify-center text-center p-8">
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                                                <Captions className="w-8 h-8 text-[#007AFF]/40" />
                                            </div>
                                            <div>
                                                <p className="text-black/60 text-sm font-medium">
                                                    No subtitles generated yet
                                                </p>
                                                <p className="text-black/40 text-xs mt-1">
                                                    Upload a file and click Generate
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="flex h-full items-center justify-center text-center p-8">
                                        <div className="space-y-4">
                                            <div className="relative mx-auto h-16 w-16">
                                                <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                                                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
                                            </div>
                                            <p className="text-[#007AFF] text-sm font-medium animate-pulse">
                                                Listening and transcribing...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {result && !isProcessing && (
                                    <textarea
                                        readOnly
                                        value={result}
                                        className="w-full h-full p-6 bg-transparent border-none resize-none font-mono text-sm text-[#1d1d1f] focus:ring-0"
                                    />
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </AppShell>
    );
}
