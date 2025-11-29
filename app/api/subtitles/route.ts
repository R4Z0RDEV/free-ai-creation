import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const WHISPER_VERSION =
    "8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e";

type ReplicatePrediction = {
    output?: {
        transcription?: string;
        segments?: any[];
        translation?: string;
        txt?: string;
        srt?: string;
        vtt?: string;
    } | string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { audio, format = "srt" } = await req.json();

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

        const replicateRes = await fetch(REPLICATE_PREDICTIONS_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
                Prefer: "wait",
            },
            body: JSON.stringify({
                version: WHISPER_VERSION,
                input: {
                    audio,
                    transcription: format,
                    model: "large-v3",
                },
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Whisper error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate subtitles" },
                { status: 500 },
            );
        }

        // Whisper output structure can vary, but usually it returns the requested format string
        // or an object containing it.
        const output = data.output;

        if (!output) {
            console.error(
                "No output in Replicate response:",
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate subtitles" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        return NextResponse.json(
            {
                id,
                createdAt,
                output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate subtitles route error:", error);
        return NextResponse.json(
            { error: "Failed to generate subtitles" },
            { status: 500 },
        );
    }
}
