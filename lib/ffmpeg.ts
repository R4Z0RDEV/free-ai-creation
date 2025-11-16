import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Try to locate ffmpeg-static binary at runtime
function getFfmpegPath(): string {
  // Common locations for ffmpeg-static
  const possiblePaths = [
    join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    join(process.cwd(), "node_modules", "ffmpeg-static", "bin", "darwin", "x64", "ffmpeg"),
    join(process.cwd(), "node_modules", "ffmpeg-static", "bin", "linux", "x64", "ffmpeg"),
    join(process.cwd(), "node_modules", "ffmpeg-static", "bin", "win32", "x64", "ffmpeg.exe"),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      console.log("[ffmpeg] Using binary at:", path);
      return path;
    }
  }

  // Fallback to system ffmpeg
  console.warn("[ffmpeg] Could not find ffmpeg-static binary, falling back to system ffmpeg");
  return "ffmpeg";
}

const FFMPEG_BIN = getFfmpegPath();

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

