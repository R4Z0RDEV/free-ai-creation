import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const FFMPEG_BIN = typeof ffmpegPath === "string" ? ffmpegPath : "ffmpeg";

export function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG_BIN, args);
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      console.error("[ffmpeg] spawn error", err);
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const error = new Error(
          `ffmpeg exited with code ${code ?? "unknown"}: ${stderr}`,
        );
        console.error("[ffmpeg] process error", error);
        reject(error);
      }
    });
  });
}

