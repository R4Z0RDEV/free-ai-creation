import path from "node:path";
import { runFfmpeg } from "./ffmpeg";

const watermarkPath = path.join(process.cwd(), "public", "watermark.png");

export async function applyVideoWatermark(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  await runFfmpeg([
    "-y",
    "-i",
    inputPath,
    "-i",
    watermarkPath,
    "-filter_complex",
    "[1:v]scale=iw*0.12:-1[wm],[0:v][wm]overlay=32:H-h-32",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "copy",
    outputPath,
  ]);
}

