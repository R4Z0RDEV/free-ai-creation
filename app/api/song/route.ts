import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const ACE_STEP_VERSION =
    "280fc4f9ee507577f880a167f639c02622421d8fecf492454320311217b688f1";

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
            tags,
            lyrics,
            duration,
            scheduler,
            guidance_type,
            guidance_scale,
            number_of_steps,
        } = await req.json();

        if (!tags || typeof tags !== "string" || tags.trim() === "") {
            return NextResponse.json(
                { error: "Tags are required" },
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
                version: ACE_STEP_VERSION,
                input: {
                    tags: tags.trim(),
                    lyrics: lyrics || "",
                    duration: duration || 60,
                    scheduler: scheduler || "euler",
                    guidance_type: guidance_type || "apg",
                    guidance_scale: guidance_scale || 15,
                    number_of_steps: number_of_steps || 60,
                },
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Ace Step error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to generate song" },
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
                { error: "Failed to generate song" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        return NextResponse.json(
            {
                id,
                prompt: tags,
                createdAt,
                audioUrl: output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate song route error:", error);
        return NextResponse.json(
            { error: "Failed to generate song" },
            { status: 500 },
        );
    }
}
