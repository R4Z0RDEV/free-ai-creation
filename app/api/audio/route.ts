import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getBaseUrl } from "@/lib/baseUrl";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const AUDIO_LDM_VERSION =
    "b61392adecdd660326fc9cfc5398182437dbe5e97b5decfb36e1a36de68b5b95";

type ReplicatePrediction = {
    output?: string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const {
            text,
            duration,
            random_seed,
            n_candidates,
            guidance_scale,
        } = await req.json();

        if (!text || typeof text !== "string" || text.trim() === "") {
            return NextResponse.json(
                { error: "Text prompt is required" },
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

        const replicateRes = await fetch(REPLICATE_PREDICTIONS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
                Prefer: "wait",
            },
            body: JSON.stringify({
                version: AUDIO_LDM_VERSION,
                input: {
                    text: text.trim(),
                    duration: duration || "5.0",
                    ...(typeof random_seed === "number" ? { random_seed } : {}),
                    n_candidates: n_candidates || 3,
                    guidance_scale: guidance_scale || 2.5,
                },
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Audio LDM error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate audio" },
                { status: 500 },
            );
        }

        const output = data.output;

        if (!output) {
            console.error(
                "No audio URL in Replicate response:",
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate audio" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        // Note: For audio, we might not need watermarking logic immediately, 
        // or we can add it later. For now, we return the Replicate URL directly 
        // or we could download and serve it. 
        // Given the image implementation saves it, we might want to do similar if we want persistence,
        // but for now let's return the direct URL as per the pattern in some other routes 
        // (though image route does watermark). 
        // The user didn't specify watermarking for audio, so direct URL is fine for MVP.

        return NextResponse.json(
            {
                id,
                prompt: text,
                createdAt,
                audioUrl: output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate audio route error:", error);
        return NextResponse.json(
            { error: "Failed to generate audio" },
            { status: 500 },
        );
    }
}
