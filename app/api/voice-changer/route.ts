import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const RVC_VERSION =
    "d18e2e0a6a6d3af183cc09622cebba8555ec9a9e66983261fc64c8b1572b7dce";

type ReplicatePrediction = {
    output?: string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { audio, pitch_change = 0, rvc_model = "Obama", custom_model_url } = await req.json();

        if (!audio || typeof audio !== "string") {
            return NextResponse.json(
                { error: "Audio is required" },
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

        const input: any = {
            input_audio: audio,
            pitch_change,
            rvc_model,
            index_rate: 0.5,
            filter_radius: 3,
            rms_mix_rate: 0.25,
            protect: 0.33,
        };

        if (rvc_model === "CUSTOM" && custom_model_url) {
            input.custom_rvc_model_download_url = custom_model_url;
        }

        const replicateRes = await fetch(REPLICATE_PREDICTIONS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
                Prefer: "wait",
            },
            body: JSON.stringify({
                version: RVC_VERSION,
                input,
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate RVC error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to change voice" },
                { status: 500 },
            );
        }

        const output = data.output;

        if (!output) {
            console.error(
                "No output in Replicate response:",
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to change voice" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        return NextResponse.json(
            {
                id,
                createdAt,
                audioUrl: output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate voice-changer route error:", error);
        return NextResponse.json(
            { error: "Failed to change voice" },
            { status: 500 },
        );
    }
}
