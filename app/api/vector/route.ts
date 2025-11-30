import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const REPLICATE_PREDICTIONS_URL = "https://api.replicate.com/v1/predictions";
const VECTORIZER_VERSION =
    "710ceb70bc468d7ee6f252a16a7d9b60e9fbe24786965dbc2e808c2de38a5a32";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { image, vectorizer, color_count } = await req.json();

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
                version: VECTORIZER_VERSION,
                input: {
                    image,
                    vectorizer: vectorizer || "vtracer",
                    color_count: color_count || 8,
                    optimize_svg: true,
                    min_area: 50,
                    threshold: 0.5,
                    simplify_tolerance: 2,
                },
            }),
        });

        let data = (await replicateRes.json()) as any;

        if (!replicateRes.ok) {
            console.error(
                "Replicate Vectorizer error:",
                replicateRes.status,
                JSON.stringify(data, null, 2),
            );
            return NextResponse.json(
                { error: "Failed to vectorize image" },
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
                { error: "Failed to vectorize: Invalid output received" },
                { status: 500 },
            );
        }

        const id = randomUUID();
        const createdAt = new Date().toISOString();

        return NextResponse.json(
            {
                id,
                createdAt,
                svgUrl: output,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replicate vector route error:", error);
        return NextResponse.json(
            { error: "Failed to vectorize image" },
            { status: 500 },
        );
    }
}
