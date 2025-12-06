import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { saveWatermarkedMedia } from "@/lib/watermarkStore";
import { getBaseUrl } from "@/lib/baseUrl";
import { applyVideoWatermark } from "@/lib/videoWatermark";

const REPLICATE_SEEDANCE_URL =
  "https://api.replicate.com/v1/models/bytedance/seedance-1-lite/predictions";

type ReplicatePrediction = {
  output?: string | string[] | null;
  error?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface GenerateVideoRequest {
  prompt: string;
  duration?: number;
  seed?: number;
  image?: string;
  aspect_ratio?: string;
  camera_fixed?: boolean;
  last_frame_image?: string;
  reference_images?: string[];
  resolution?: string;
  fps?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json();
    const {
      prompt,
      duration,
      seed,
      image,
      aspect_ratio,
      camera_fixed,
      last_frame_image,
      reference_images,
      resolution,
      fps,
    } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.error("REPLICATE_API_TOKEN is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const requestedDuration =
      typeof duration === "number" && Number.isFinite(duration) ? duration : 5;
    const finalDuration = Math.max(2, Math.min(5, requestedDuration));

    const finalResolution = "480p";

    const finalFps = typeof fps === "number" && fps === 24 ? 24 : 24;

    const finalAspectRatio =
      typeof aspect_ratio === "string" && aspect_ratio.trim()
        ? aspect_ratio.trim()
        : "16:9";

    const input: Record<string, unknown> = {
      prompt: prompt.trim(),
      duration: finalDuration,
      resolution: finalResolution,
      aspect_ratio: finalAspectRatio,
      fps: finalFps,
    };

    if (typeof seed === "number" && Number.isFinite(seed)) {
      input.seed = seed;
    }

    if (image && image.trim()) {
      input.image = image.trim();
    }

    if (typeof camera_fixed === "boolean") {
      input.camera_fixed = camera_fixed;
    }

    if (last_frame_image && last_frame_image.trim()) {
      input.last_frame_image = last_frame_image.trim();
    }

    const referenceImages =
      Array.isArray(reference_images) && reference_images.length > 0
        ? reference_images
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
        : [];

    if (referenceImages.length > 0) {
      input.reference_images = referenceImages;
    }

    const replicateRes = await fetch(REPLICATE_SEEDANCE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({ input }),
    });

    const data = (await replicateRes.json()) as ReplicatePrediction;

    if (!replicateRes.ok) {
      console.error(
        "Replicate video model error:",
        replicateRes.status,
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: "Failed to generate video" },
        { status: 500 },
      );
    }

    const output = data.output;
    let videoUrl: string | null = null;

    if (Array.isArray(output) && output.length > 0) {
      videoUrl = output[0] ?? null;
    } else if (typeof output === "string") {
      videoUrl = output;
    }

    if (!videoUrl) {
      console.error(
        "No video URL in Replicate video response:",
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: "Failed to generate video" },
        { status: 500 },
      );
    }

    const baseUrl = getBaseUrl(request);
    const id = randomUUID();
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "fac-video-"));
    const inputPath = path.join(tmpDir, "input.mp4");
    const outputPath = path.join(tmpDir, "output.mp4");
    let finalVideoUrl = videoUrl;

    try {
      const downloadRes = await fetch(videoUrl);
      if (!downloadRes.ok) {
        throw new Error("Failed to download generated video");
      }
      const buffer = Buffer.from(await downloadRes.arrayBuffer());
      await fs.writeFile(inputPath, buffer);
      await applyVideoWatermark(inputPath, outputPath);
      const watermarked = await fs.readFile(outputPath);
      await saveWatermarkedMedia(id, watermarked, {
        originalUrl: videoUrl,
        mimeType: "video/mp4",
        extension: "mp4",
      });
      finalVideoUrl = `${baseUrl}/api/media/${id}`;
    } catch (error) {
      console.error("Video watermark pipeline failed; using original URL", error);
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }

    return NextResponse.json({ videoUrl: finalVideoUrl }, { status: 200 });
  } catch (error) {
    console.error("Replicate video route error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 },
    );
  }
}
