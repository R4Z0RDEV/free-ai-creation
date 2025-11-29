import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const ERASER_VERSION =
    "826441c948a5792375c071be1dcd02e018592595ae9aa7ca756bf8e04c1bffc1";

type ReplicatePrediction = {
    output?: string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { init_image, mask_image } = await req.json();

        if (!init_image || typeof init_image !== "string") {
            return NextResponse.json(
                { error: "Original image is required" },
                { status: 400 },
            );
        }
        if (!mask_image || typeof mask_image !== "string") {
            return NextResponse.json(
                { error: "Mask image is required" },
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
                version: ERASER_VERSION,
                input: {
                    image: init_image,
                    mask: mask_image,
                },
            }),
        });

        const data = (await replicateRes.json()) as ReplicatePrediction;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Eraser error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to erase object" },
                { status: 500 },
            );
        }

        const output = data.output;

        if (!output) {
            console.error(
                "No image URL in Replicate response:",
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to erase object" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        return NextResponse.json(
            {
                id,
                createdAt,
                originalUrl: output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate eraser route error:", error);
        return NextResponse.json(
            { error: "Failed to erase object" },
            { status: 500 },
        );
    }
}
