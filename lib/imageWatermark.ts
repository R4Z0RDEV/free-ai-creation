import path from "node:path";

const WATERMARK_PATH = path.join(process.cwd(), "public", "watermark.png");

let sharp: typeof import("sharp") | null = null;

// Try to load sharp, but don't fail if it's not available (e.g., in Vercel)
try {
  sharp = require("sharp");
} catch (e) {
  console.warn("Sharp module not available, watermarking will be skipped");
}

export async function applyImageWatermarkFromUrl(
  originalUrl: string,
): Promise<Buffer | null> {
  // If sharp is not available, return null to skip watermarking
  if (!sharp) {
    console.warn("Skipping watermark: sharp not available");
    return null;
  }

  try {
    const res = await fetch(originalUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch original image for watermarking");
    }

    const originalBuffer = Buffer.from(await res.arrayBuffer());
    const base = sharp(originalBuffer);
    const metadata = await base.metadata();
    const computedWidth = Math.round((metadata.width ?? 1024) * 0.6);

    const watermark = await sharp(WATERMARK_PATH)
      .resize({
        width: computedWidth,
      })
      .png()
      .toBuffer();

    const watermarked = await base
      .composite([
        {
          input: watermark,
          gravity: "south",
          blend: "over",
        },
      ])
      .png()
      .toBuffer();

    return watermarked;
  } catch (error) {
    console.error("Watermark processing failed:", error);
    return null;
  }
}
