import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const RMBG_VERSION =
    "e89200fbc08c5c5e9314e246db83a79d43f16c552dc4005e46cd7896800a989e";

type ReplicatePrediction = {
    output?: string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image || typeof image !== "string") {
            return NextResponse.json(
                { error: "Image is required" },
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
                version: RMBG_VERSION,
                input: {
                    image,
                },
            }),
        });

        let data = (await replicateRes.json()) as any;

        if (!replicateRes.ok) {
            console.error(
                "Replicate RMBG error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to remove background" },
                { status: 500 },
            );
        }

        // Poll if status is not terminal
        if (data.status !== "succeeded" && data.status !== "failed" && data.status !== "canceled") {
            const pollUrl = data.urls?.get;
            if (pollUrl) {
                let maxAttempts = 60;
                while (maxAttempts > 0) {
                    if (data.status === "succeeded" || data.status === "failed" || data.status === "canceled") {
                        break;
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const pollRes = await fetch(pollUrl, {
                        headers: {
                            Authorization: `Bearer ${apiToken}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!pollRes.ok) {
                        console.error("Polling failed:", pollRes.status);
                        break;
                    }

                    data = await pollRes.json();
                    maxAttempts--;
                }
            }
        }

        if (data.status === "failed" || data.status === "canceled") {
            console.error("Replicate prediction failed:", data.error);
            return NextResponse.json(
                { error: `Processing failed: ${data.error || "Unknown error"}` },
                { status: 500 }
            );
        }

        const output = data.output;

        if (!output || typeof output !== 'string' || !output.startsWith('http')) {
            console.error(
                "Invalid output from Replicate:",
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to remove background: Invalid output received" },
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
        console.error("Replicate remove-bg route error:", error);
        return NextResponse.json(
            { error: "Failed to remove background" },
            { status: 500 },
        );
    }
}
