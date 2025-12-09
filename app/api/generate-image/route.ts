import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveWatermarkedImage } from "@/lib/watermarkStore";
import { applyImageWatermarkFromUrl } from "@/lib/imageWatermark";
import { getBaseUrl } from "@/lib/baseUrl";

const REPLICATE_API_URL = "https://api.replicate.com/v1/models/prunaai/z-image-turbo/predictions";

type ReplicatePrediction = {
  id?: string;
  status?: string;
  output?: string | string[] | null;
  error?: string;
  urls?: {
    get?: string;
  };
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildPrompt(
  prompt: string,
  style?: string,
): string {
  const base = prompt.trim();
  if (!style) return base;

  switch (style) {
    case "photo":
      return `${base}, ultra realistic, 4k, cinematic lighting`;
    case "illustration":
      return `${base}, digital illustration, clean lines, concept art`;
    case "anime":
      return `${base}, anime style, vibrant colors, sharp lines`;
    case "painting":
      return `${base}, oil painting, textured brushstrokes, artstation`;
    default:
      return base;
  }
}

function parseResolution(resolution?: string): {
  width?: number;
  height?: number;
} {
  if (!resolution) return { width: 1024, height: 1024 };
  const match = resolution.match(/(\d+)x(\d+)/i);
  if (!match) return { width: 1024, height: 1024 };
  const width = Math.min(1440, Math.max(64, Number(match[1])));
  const height = Math.min(1440, Math.max(64, Number(match[2])));
  if (!Number.isFinite(width) || !Number.isFinite(height)) return { width: 1024, height: 1024 };
  return { width, height };
}

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      resolution,
      style,
      seed,
      width,
      height,
      guidance_scale,
      num_inference_steps,
      output_format,
      output_quality,
    } = await req.json();

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

    const finalPrompt = buildPrompt(prompt, style);
    const resolutionSize = parseResolution(resolution);

    // Build input with z-image-turbo schema
    const input: Record<string, unknown> = {
      prompt: finalPrompt,
      width: typeof width === "number" && Number.isFinite(width) ? Math.min(1440, Math.max(64, width)) : resolutionSize.width,
      height: typeof height === "number" && Number.isFinite(height) ? Math.min(1440, Math.max(64, height)) : resolutionSize.height,
      output_format: output_format || "jpg",
      output_quality: typeof output_quality === "number" ? Math.min(100, Math.max(0, output_quality)) : 80,
      num_inference_steps: typeof num_inference_steps === "number" ? Math.min(50, Math.max(1, num_inference_steps)) : 8,
      guidance_scale: typeof guidance_scale === "number" ? Math.min(20, Math.max(0, guidance_scale)) : 0,
    };

    if (typeof seed === "number" && Number.isFinite(seed)) {
      input.seed = seed;
    }

    const replicateRes = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Prefer": "wait",
      },
      body: JSON.stringify({ input }),
    });

    const data = (await replicateRes.json()) as ReplicatePrediction;

    if (!replicateRes.ok) {
      console.error(
        "Replicate z-image-turbo error:",
        replicateRes.status,
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: data.error || "Failed to generate image" },
        { status: 500 },
      );
    }

    const output = data.output;
    let imageUrl: string | null = null;

    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0] ?? null;
    } else if (typeof output === "string") {
      imageUrl = output;
    }

    if (!imageUrl) {
      console.error(
        "No image URL in Replicate response:",
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 },
      );
    }

    const id = randomUUID();
    const watermarkedBuffer = await applyImageWatermarkFromUrl(imageUrl);
    await saveWatermarkedImage(id, watermarkedBuffer, imageUrl);

    const baseUrl = getBaseUrl(req);
    const watermarkedUrl = `${baseUrl}/api/media/${id}`;
    const createdAt = new Date().toISOString();

    return NextResponse.json(
      {
        id,
        prompt,
        createdAt,
        originalUrl: imageUrl,
        watermarkedUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Replicate image route error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
