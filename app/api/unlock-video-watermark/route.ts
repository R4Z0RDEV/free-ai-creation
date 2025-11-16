import { NextRequest, NextResponse } from "next/server";
import { loadOriginalUrl } from "@/lib/watermarkStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId } = body;

    if (!mediaId || typeof mediaId !== "string") {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 },
      );
    }

    const originalUrl = await loadOriginalUrl(mediaId);

    if (!originalUrl) {
      return NextResponse.json(
        { error: "Original video URL not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ cleanUrl: originalUrl }, { status: 200 });
  } catch (error) {
    console.error("Unlock video watermark error:", error);
    return NextResponse.json(
      { error: "Failed to unlock watermark" },
      { status: 500 },
    );
  }
}

