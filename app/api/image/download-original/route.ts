import { NextResponse } from "next/server";
import { loadOriginalUrl } from "@/lib/watermarkStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const originalUrl = await loadOriginalUrl(id);
  if (!originalUrl) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const response = await fetch(originalUrl);
  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to proxy original image" },
      { status: 502 },
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/png",
      "Content-Disposition": `attachment; filename="ai-image-${id}.png"`,
      "Cache-Control": "no-store",
    },
  });
}

