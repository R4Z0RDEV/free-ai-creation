import { NextResponse } from "next/server";
import { loadWatermarkedMedia } from "@/lib/watermarkStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const media = await loadWatermarkedMedia(params.id);

  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(media.buffer, {
    status: 200,
    headers: {
      "Content-Type": media.meta.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
