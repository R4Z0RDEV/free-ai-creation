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
    "[1:v]scale=main_w*0.18:-1[wm];[0:v][wm]overlay=main_w-overlay_w-32:main_h-overlay_h-32",
    "-c:a",
    "copy",
    outputPath,
  ]);
}

