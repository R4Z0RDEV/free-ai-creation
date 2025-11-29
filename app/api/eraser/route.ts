import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const ERASER_VERSION =
    "0e3a841c913f597c1e4c321560aa69e2bc1f15c65f8c366caafc379240efd8ba";

type ReplicatePrediction = {
    output?: string | null;
    error?: string;
    status?: string;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { image, mask } = await req.json();

        if (!image || typeof image !== "string") {
            return NextResponse.json(
                { error: "Original image is required" },
                { status: 400 },
            );
        }
        if (!mask || typeof mask !== "string") {
            return NextResponse.json(
                { error: "Mask image is required" },
                { status: 400 },
            );
        }

        console.log(`Received image: ${image.substring(0, 50)}... (${image.length} chars)`);
        console.log(`Received mask: ${mask.substring(0, 50)}... (${mask.length} chars)`);

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
                    image: image,
                    mask: mask,
                },
            }),
        });

        let data = (await replicateRes.json()) as any;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Eraser error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: `Failed to erase object: ${data.error || replicateRes.statusText}` },
                { status: 500 },
            );
        }

        // Poll if status is not terminal
        if (data.status !== "succeeded" && data.status !== "failed" && data.status !== "canceled") {
            const pollUrl = data.urls?.get;
            if (pollUrl) {
                let maxAttempts = 60; // Increase to 60 seconds
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
                    if (pollRes.ok) {
                        data = await pollRes.json();
                    } else {
                        console.warn("Polling failed:", pollRes.status);
                    }
                    maxAttempts--;
                }
            }
        }

        console.log("Final Replicate Status:", data.status);
        console.log("Final Replicate Output:", data.output);
        console.log("Full Replicate Data:", JSON.stringify(data, null, 2));

        const output = data.output;

        if (!output || typeof output !== 'string' || !output.startsWith('http')) {
            console.error(
                "Invalid output from Replicate:",
                JSON.stringify(data, null, 2),
            );

            if (output === "No input, Save money") {
                return NextResponse.json(
                    { error: "Please highlight the object you want to erase" },
                    { status: 400 },
                );
            }

            return NextResponse.json(
                { error: "Failed to erase object: Invalid output received" },
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
            { error: `Failed to erase object: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 },
        );
    }
}
