'use client';

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/Layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Upload, Eraser, Undo, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { cn } from "@/lib/utils";

type EraserResult = {
    id: string;
    originalUrl: string;
};

export default function EraserStudioPage() {
    return <EraserStudioContent />;
}

function EraserStudioContent() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [result, setResult] = useState<EraserResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [brushSize, setBrushSize] = useState(20);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (originalImage && imageCanvasRef.current && maskCanvasRef.current) {
            const img = new Image();
            img.src = originalImage;
            img.onload = () => {
                const maxHeight = 400;
                const maxWidth = imageCanvasRef.current?.parentElement?.clientWidth || 600;

                let width = img.width;
                let height = img.height;

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                setDimensions({ width, height });

                // Setup Image Canvas
                const imgCanvas = imageCanvasRef.current!;
                imgCanvas.width = width;
                imgCanvas.height = height;
                const imgCtx = imgCanvas.getContext('2d');
                if (imgCtx) imgCtx.drawImage(img, 0, 0, width, height);

                // Setup Mask Canvas (Transparent on top)
                const maskCanvas = maskCanvasRef.current!;
                maskCanvas.width = width;
                maskCanvas.height = height;
                const maskCtx = maskCanvas.getContext('2d');
                if (maskCtx) {
                    maskCtx.clearRect(0, 0, width, height);
                }
            };
        }
    }, [originalImage]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = maskCanvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath();
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !maskCanvasRef.current) return;
        const canvas = maskCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Visual feedback

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleResetMask = () => {
        const canvas = maskCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleErase = async () => {
        if (!originalImage || !maskCanvasRef.current) return;

        setIsProcessing(true);

        try {
            // Generate binary mask from the visual mask canvas
            const visualCanvas = maskCanvasRef.current;
            const binaryCanvas = document.createElement('canvas');
            binaryCanvas.width = visualCanvas.width;
            binaryCanvas.height = visualCanvas.height;
            const binaryCtx = binaryCanvas.getContext('2d');

            if (!binaryCtx) throw new Error("Failed to create mask context");

            // Fill black (keep)
            binaryCtx.fillStyle = 'black';
            binaryCtx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);

            // Draw white (erase) where user drew red
            // We can use the visual canvas as source, but we need to treat non-transparent pixels as white
            binaryCtx.drawImage(visualCanvas, 0, 0);

            // Convert non-black pixels to white
            const imageData = binaryCtx.getImageData(0, 0, binaryCanvas.width, binaryCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                // If alpha > 0, make it white
                if (data[i + 3] > 0) {
                    data[i] = 255;
                    data[i + 1] = 255;
                    data[i + 2] = 255;
                    data[i + 3] = 255; // Full opacity
                }
            }
            binaryCtx.putImageData(imageData, 0, 0);

            const maskDataUrl = binaryCanvas.toDataURL('image/png');

            const response = await fetch('/api/eraser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    init_image: originalImage,
                    mask_image: maskDataUrl
                }),
            });

            if (!response.ok) throw new Error('Failed to erase');

            const resData = await response.json();
            setResult({
                id: resData.id,
                originalUrl: resData.originalUrl
            });
            toast.success('Object erased successfully!');

        } catch (error) {
            console.error(error);
            toast.error('Failed to erase object');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!result?.originalUrl) return;
        const a = document.createElement('a');
        a.href = result.originalUrl;
        a.download = `erased-${result.id}.png`;
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
                        <Eraser className="h-8 w-8" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#1d1d1f] sm:text-5xl">
                        AI Magic Eraser
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-black/60">
                        Highlight any object, person, or text to remove it from your image instantly.
                    </p>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left Panel */}
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

                                <div className="space-y-3">
                                    <Label className="label-glass">Brush Size</Label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-black/40 uppercase tracking-wider">Small</span>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            value={brushSize}
                                            onChange={(e) => setBrushSize(Number(e.target.value))}
                                            className="flex-1 h-1.5 rounded-full bg-black/10 accent-[#007AFF] cursor-pointer"
                                        />
                                        <span className="text-[10px] text-black/40 uppercase tracking-wider">Large</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleResetMask}
                                        variant="outline"
                                        className="flex-1 btn-glass h-10 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5"
                                        disabled={!originalImage || isProcessing}
                                    >
                                        <Undo className="w-3.5 h-3.5 mr-1.5" />
                                        Clear Mask
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleErase}
                                    disabled={isProcessing || !originalImage}
                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] border-transparent shadow-lg hover:shadow-xl h-12"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Erasing...
                                        </>
                                    ) : (
                                        <>
                                            <Eraser className="w-4 h-4 mr-2" />
                                            Erase Object
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
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Right Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* Editor */}
                            <GlassCard className="flex flex-col p-1 h-full min-h-[400px]">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-black/70 uppercase flex items-center gap-2">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Editor
                                    </h2>
                                    {originalImage && (
                                        <span className="text-[10px] text-[#007AFF] font-medium bg-[#007AFF]/10 px-2 py-0.5 rounded-full border border-[#007AFF]/20">
                                            Draw over objects to remove
                                        </span>
                                    )}
                                </div>
                                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden rounded-b-3xl">
                                    {!originalImage ? (
                                        <div className="text-center space-y-4 p-8">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-white/50 border border-white/60 flex items-center justify-center shadow-sm">
                                                <Upload className="w-8 h-8 text-black/20" />
                                            </div>
                                            <p className="text-black/60 text-sm font-medium">
                                                Upload an image to start
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
                                            <canvas
                                                ref={imageCanvasRef}
                                                className="absolute top-0 left-0 rounded-lg pointer-events-none"
                                            />
                                            <canvas
                                                ref={maskCanvasRef}
                                                className="absolute top-0 left-0 rounded-lg cursor-crosshair touch-none"
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                            />
                                        </div>
                                    )}
                                </div>
                            </GlassCard>

                            {/* Result */}
                            <GlassCard className="flex flex-col p-1 h-full min-h-[400px] ring-1 ring-[#007AFF]/20 shadow-lg shadow-[#007AFF]/5">
                                <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 bg-white/40">
                                    <h2 className="text-xs font-bold tracking-[0.2em] text-[#007AFF] uppercase flex items-center gap-2">
                                        <Eraser className="w-3.5 h-3.5" />
                                        Result
                                    </h2>
                                </div>
                                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden rounded-b-3xl">
                                    {!result && !isProcessing && (
                                        <div className="text-center space-y-4 p-8">
                                            <div className="w-20 h-20 mx-auto rounded-full bg-[#007AFF]/5 border border-[#007AFF]/10 flex items-center justify-center">
                                                <Eraser className="w-8 h-8 text-[#007AFF]/40" />
                                            </div>
                                            <p className="text-black/60 text-sm font-medium">
                                                No result yet
                                            </p>
                                        </div>
                                    )}

                                    {isProcessing && (
                                        <div className="text-center space-y-4">
                                            <div className="relative mx-auto h-16 w-16">
                                                <div className="absolute inset-0 rounded-full border-2 border-[#007AFF]/10" />
                                                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#007AFF] animate-spin" />
                                            </div>
                                            <p className="text-[#007AFF] text-sm font-medium animate-pulse">
                                                Erasing object...
                                            </p>
                                        </div>
                                    )}

                                    {originalImage && result && !isProcessing && (
                                        <BeforeAfterSlider
                                            beforeSrc={originalImage}
                                            afterSrc={result.originalUrl}
                                            alt="Eraser comparison"
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
