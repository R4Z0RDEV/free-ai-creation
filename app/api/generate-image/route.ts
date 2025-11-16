import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { saveWatermarkedImage } from "@/lib/watermarkStore";
import { applyImageWatermarkFromUrl } from "@/lib/imageWatermark";
import { getBaseUrl } from "@/lib/baseUrl";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const STABLE_DIFFUSION_VERSION =
  "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";

type ReplicatePrediction = {
  output?: string | string[] | null;
  error?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildStableDiffusionPrompt(
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
  if (!resolution) return {};
  const match = resolution.match(/(\d+)x(\d+)/i);
  if (!match) return {};
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return {};
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
      scheduler,
      num_outputs,
      guidance_scale,
      negative_prompt,
      num_inference_steps,
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

    const finalPrompt = buildStableDiffusionPrompt(prompt, style);
    const resolutionSize = parseResolution(resolution);

    const replicateRes = await fetch(REPLICATE_PREDICTIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        version: STABLE_DIFFUSION_VERSION,
        input: {
          prompt: finalPrompt,
          scheduler: scheduler || "K_EULER",
          ...(resolutionSize.width && resolutionSize.height
            ? { width: resolutionSize.width, height: resolutionSize.height }
            : {}),
          ...(typeof seed === "number" && Number.isFinite(seed)
            ? { seed }
            : {}),
          ...(typeof width === "number" && Number.isFinite(width)
            ? { width }
            : {}),
          ...(typeof height === "number" && Number.isFinite(height)
            ? { height }
            : {}),
          ...(typeof num_outputs === "number" && Number.isFinite(num_outputs)
            ? { num_outputs }
            : {}),
          ...(typeof guidance_scale === "number" &&
          Number.isFinite(guidance_scale)
            ? { guidance_scale }
            : {}),
          ...(typeof num_inference_steps === "number" &&
          Number.isFinite(num_inference_steps)
            ? { num_inference_steps }
            : {}),
          ...(negative_prompt && negative_prompt.trim()
            ? { negative_prompt: negative_prompt.trim() }
            : {}),
        },
      }),
    });

    const data = (await replicateRes.json()) as ReplicatePrediction;

    if (!replicateRes.ok) {
      console.error(
        "Replicate Stable Diffusion error:",
        replicateRes.status,
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: "Failed to generate image" },
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
