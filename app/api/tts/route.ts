import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const MELOTTS_VERSION =
    "2e4d356f3715d98c183ef097ce2cf410def83ca9fbbdd5f8a32ba056123e6a6f";

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
            speed,
            speaker,
            language,
        } = await req.json();

        if (!text || typeof text !== "string" || text.trim() === "") {
            return NextResponse.json(
                { error: "Text is required" },
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
                version: MELOTTS_VERSION,
                input: {
                    text: text.trim(),
                    speed: speed || 1.0,
                    speaker: speaker || "EN-US",
                    language: language || "EN",
                },
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate TTS error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate speech" },
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
                { error: "Failed to generate speech" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

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
        console.error("Replicate TTS route error:", error);
        return NextResponse.json(
            { error: "Failed to generate speech" },
            { status: 500 },
        );
    }
}
