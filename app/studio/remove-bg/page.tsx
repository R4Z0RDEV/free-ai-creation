'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Upload, Scissors, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { cn } from "@/lib/utils";

type RemoveBgResult = {
    id: string;
    originalUrl: string;
};

export default function RemoveBgStudioPage() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [result, setResult] = useState<RemoveBgResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        // Convert to JPEG to ensure RGB (3 channels) and avoid tensor mismatch (4 vs 3)
                        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
                        setOriginalImage(jpegDataUrl);
                        setResult(null);
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBg = async () => {
        if (!originalImage) {
            toast.error('Please upload an image first');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/remove-bg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: originalImage,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove background');
            }

            const data = await response.json();
            setResult({
                id: data.id,
                originalUrl: data.originalUrl,
            });
            toast.success('Background removed successfully!');
        } catch (error) {
            console.error('Processing error:', error);
            toast.error('Failed to remove background');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result?.originalUrl) return;
        const a = document.createElement('a');
        a.href = result.originalUrl;
        a.download = `no-bg-${result.id}.png`;
        a.click();
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
                        <Scissors className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        AI Background Remover
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Automatically detect and remove backgrounds from your photos with high precision.
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
                                        disabled={isProcessing}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {originalImage ? "Change Image" : "Choose Image"}
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleRemoveBg}
                                    disabled={isProcessing || !originalImage}
                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Scissors className="w-4 h-4 mr-2" />
                                            Remove Background
                                        </>
                                    )}
                                </Button>

                                {result && (
                                    <Button
                                        onClick={handleDownload}
                                        variant="outline"
                                        className="w-full btn-glass h-12"
                                        disabled={isProcessing}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Result
                                    </Button>
                                )}

                                <div className="pt-4 border-t border-black/5 text-[10px] text-black/40 leading-relaxed space-y-1">
                                    <p className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                                        Works best with clear subjects
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-[#007AFF]" />
                                        Images are processed securely
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Right Panel - Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Original */}
                            <GlassCard className="flex flex-col p-1 h-full min-h-[400px]">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-black/70 uppercase flex items-center gap-2">
                                        <ImageIcon className="w-3.5 h-3.5" />
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
                                                    Click &quot;Choose Image&quot; to get started
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

                            {/* Result */}
                            <GlassCard className="flex flex-col p-1 h-full min-h-[400px] ring-1 ring-[#007AFF]/20 shadow-lg shadow-[#007AFF]/5">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                                        <Scissors className="w-3.5 h-3.5" />
                                        Result
                                    </h2>
                                    {result && (
                                        <span className="rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#007AFF] border border-[#007AFF]/20">
                                            Processed
                                        </span>
                                    )}
                                </div>
                                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden checkerboard-bg rounded-b-3xl">
                                    {!result && !isProcessing && (
                                        <div className="text-center space-y-4 p-8">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                                                <Scissors className="w-8 h-8 text-[#007AFF]/40" />
                                            </div>
                                            <div>
                                                <p className="text-black/60 text-sm font-medium">
                                                    No result yet
                                                </p>
                                                <p className="text-black/40 text-xs mt-1">
                                                    Click &quot;Remove Background&quot; to process
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
                                                Removing background...
                                            </p>
                                        </div>
                                    )}

                                    {originalImage && result && !isProcessing && (
                                        <BeforeAfterSlider
                                            beforeSrc={originalImage}
                                            afterSrc={result.originalUrl}
                                            alt="Background removal comparison"
                                            className="h-full w-full absolute inset-0"
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
