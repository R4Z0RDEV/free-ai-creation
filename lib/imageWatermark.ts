import path from "node:path";
import sharp from "sharp";

const WATERMARK_PATH = path.join(process.cwd(), "public", "watermark.png");

export async function applyImageWatermarkFromUrl(
  originalUrl: string,
): Promise<Buffer> {
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
}

