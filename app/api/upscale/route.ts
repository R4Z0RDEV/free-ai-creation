import { NextRequest, NextResponse } from "next/server";

const REPLICATE_ENDPOINT =
  "https://api.replicate.com/v1/models/nightmareai/real-esrgan/predictions";

export const dynamic = "force-dynamic";

type UpscaleRequest = {
  image?: string;
  scale?: number;
  scaleFactor?: "2x" | "4x";
  mode?: "standard" | "high-detail";
  face_enhance?: boolean;
};

type ReplicateResponse = {
  output?: string | string[];
};

export async function POST(req: NextRequest) {
  try {
    const {
      image,
      scale,
      scaleFactor = "2x",
      mode = "standard",
      face_enhance,
    } = (await req.json()) as UpscaleRequest;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 },
      );
    }

    // Placeholder to swap models/checkpoints by `mode` in the future.
    const endpoint = REPLICATE_ENDPOINT;

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      console.error("REPLICATE_API_TOKEN is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    let finalScale = typeof scale === "number" && scale > 0 ? scale : 2;
    if (!scale && scaleFactor === "4x") {
      finalScale = 4;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: {
          image,
          scale: finalScale,
          ...(typeof face_enhance === "boolean" && {
            face_enhance,
          }),
        },
      }),
    });

    const data = (await response.json()) as ReplicateResponse;

    if (!response.ok) {
      console.error(
        "Replicate upscale error:",
        response.status,
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { error: "Failed to upscale image" },
        { status: response.status },
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
        { error: "No upscaled image returned from model" },
        { status: 500 },
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Upscale route error:", error);
    return NextResponse.json(
      { error: "Failed to upscale image" },
      { status: 500 },
    );
  }
}
