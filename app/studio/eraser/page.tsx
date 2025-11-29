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

    const [hasDrawn, setHasDrawn] = useState(false);

    const [debugMask, setDebugMask] = useState<string | null>(null);

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
                setHasDrawn(false);
                setDebugMask(null);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (originalImage && imageCanvasRef.current && maskCanvasRef.current) {
            const img = new Image();
            img.src = originalImage;
            img.onload = () => {
                // Calculate dimensions to fit within the container while preserving aspect ratio
                const container = imageCanvasRef.current?.parentElement?.parentElement;
                const containerWidth = container?.clientWidth || 800;
                const containerHeight = container?.clientHeight || 600;

                // Add some padding
                const maxWidth = containerWidth - 40;
                const maxHeight = containerHeight - 40;

                let width = img.width;
                let height = img.height;

                // Calculate aspect ratios
                const imgAspectRatio = width / height;
                const containerAspectRatio = maxWidth / maxHeight;

                if (imgAspectRatio > containerAspectRatio) {
                    // Image is wider than container
                    width = maxWidth;
                    height = width / imgAspectRatio;
                } else {
                    // Image is taller than container
                    height = maxHeight;
                    width = height * imgAspectRatio;
                }

                setDimensions({ width, height });

                // Setup Image Canvas
                const imgCanvas = imageCanvasRef.current!;
                imgCanvas.width = width;
                imgCanvas.height = height;
                const imgCtx = imgCanvas.getContext('2d');
                if (imgCtx) {
                    // Use high quality image scaling
                    imgCtx.imageSmoothingEnabled = true;
                    imgCtx.imageSmoothingQuality = 'high';
                    imgCtx.drawImage(img, 0, 0, width, height);
                }

                // Setup Mask Canvas (Transparent on top)
                const maskCanvas = maskCanvasRef.current!;
                maskCanvas.width = width;
                maskCanvas.height = height;
                const maskCtx = maskCanvas.getContext('2d');
                if (maskCtx) {
                    maskCtx.clearRect(0, 0, width, height);
                }
                setHasDrawn(false);
                setDebugMask(null);
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

        if (!hasDrawn) setHasDrawn(true);
    };

    const handleResetMask = () => {
        const canvas = maskCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasDrawn(false);
            setDebugMask(null);
        }
    };

    const handleErase = async () => {
        if (!imageCanvasRef.current || !maskCanvasRef.current) return;

        if (!hasDrawn) {
            toast.error('Please highlight the object you want to erase');
            return;
        }

        setIsProcessing(true);
        setDebugMask(null);

        try {
            // Generate binary mask from the visual mask canvas
            const visualCanvas = maskCanvasRef.current;
            const width = visualCanvas.width;
            const height = visualCanvas.height;
            const binaryCanvas = document.createElement('canvas');
            binaryCanvas.width = width;
            binaryCanvas.height = height;
            const binaryCtx = binaryCanvas.getContext('2d');

            if (!binaryCtx) throw new Error("Failed to create mask context");

            // Get the visual mask data (red strokes on transparent)
            const visualCtx = visualCanvas.getContext('2d');
            if (!visualCtx) throw new Error("Failed to get visual context");
            const visualData = visualCtx.getImageData(0, 0, width, height);

            // Create new image data for the binary mask
            const binaryData = binaryCtx.createImageData(width, height);

            // Convert pixels: Alpha > 0 -> White (Erase), Alpha == 0 -> Transparent (Keep)
            for (let i = 0; i < visualData.data.length; i += 4) {
                const alpha = visualData.data[i + 3];
                if (alpha > 0) {
                    // Mask area (White - Erase this)
                    binaryData.data[i] = 255;     // R
                    binaryData.data[i + 1] = 255; // G
                    binaryData.data[i + 2] = 255; // B
                    binaryData.data[i + 3] = 255; // A
                } else {
                    // Background (Transparent - Keep this)
                    binaryData.data[i] = 0;       // R
                    binaryData.data[i + 1] = 0;   // G
                    binaryData.data[i + 2] = 0;   // B
                    binaryData.data[i + 3] = 0;   // A
                }
            }

            binaryCtx.putImageData(binaryData, 0, 0);

            // Get base64 strings
            // Convert image to JPEG to ensure RGB (3 channels) and remove Alpha, as required by the model
            const imageBase64 = imageCanvasRef.current.toDataURL('image/jpeg', 0.95);
            const maskBase64 = binaryCanvas.toDataURL('image/png');

            setDebugMask(maskBase64);

            const response = await fetch('/api/eraser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageBase64,
                    mask: maskBase64
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to erase');
            }

            const resData = await response.json();
            setResult({
                id: resData.id,
                originalUrl: resData.originalUrl
            });
            toast.success('Object erased successfully!');

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'Failed to erase object');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (result?.originalUrl) {
            try {
                const response = await fetch(result.originalUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'erased-image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
                toast.error('Failed to download image');
            }
        }
    };

    return (
        <AppShell>
            <div className="max-w-7xl mx-auto space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-black/5 mb-4">
                        <Eraser className="w-8 h-8 text-[#007AFF]" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-black">
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

                                {/* Debug View for Mask */}
                                {debugMask && (
                                    <div className="mt-4 p-4 border border-black/10 rounded-xl bg-white/50">
                                        <h3 className="text-xs font-bold uppercase text-black/50 mb-2">Debug: Generated Mask</h3>
                                        <div className="relative h-40 w-full bg-[url('/grid.png')] bg-repeat rounded-lg overflow-hidden border border-black/10">
                                            {/* Checkered background for transparency check */}
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                                backgroundSize: '20px 20px',
                                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                            }} />
                                            <img
                                                src={debugMask}
                                                alt="Debug Mask"
                                                className="relative h-full w-auto mx-auto object-contain"
                                                style={{ border: '1px solid red' }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-black/40 mt-1 font-mono break-all">
                                            Mask format: Transparent PNG (White=Erase, Transparent=Keep)
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-center gap-4">
                                    <Button
                                        onClick={handleResetMask}
                                        variant="outline"
                                        className="btn-glass text-black/70 border-black/10 hover:bg-black/5"
                                        disabled={isProcessing || !hasDrawn}
                                    >
                                        Reset Mask
                                    </Button>
                                    <Button
                                        onClick={handleErase}
                                        disabled={isProcessing || !hasDrawn}
                                        className="btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC]"
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
                                </div>
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

                                    {originalImage && result && !isProcessing && result.originalUrl && result.originalUrl.startsWith('http') && (
                                        <>
                                            <BeforeAfterSlider
                                                beforeSrc={originalImage}
                                                afterSrc={result.originalUrl}
                                                alt="Eraser comparison"
                                                className="h-full w-full absolute inset-0"
                                            />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <Button
                                                    onClick={handleDownload}
                                                    className="w-full btn-glass bg-[#007AFF] text-white hover:bg-[#0066CC] shadow-lg"
                                                    disabled={isProcessing}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Result
                                                </Button>
                                            </div>
                                        </>
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
