import fs from "node:fs";
import path from "node:path";

const STORAGE_DIR = path.join(process.cwd(), "public", "generated");

type MediaMeta = {
  originalUrl: string;
  createdAt: string;
  mimeType: string;
  extension: string;
};

async function ensureStorageDir() {
  await fs.promises.mkdir(STORAGE_DIR, { recursive: true });
}

function sanitizeExtension(extension: string) {
  return extension.replace(/^\./, "");
}

export async function saveWatermarkedMedia(
  id: string,
  buffer: Buffer,
  {
    originalUrl,
    mimeType,
    extension,
  }: { originalUrl: string; mimeType: string; extension: string },
) {
  await ensureStorageDir();
  const normalizedExtension = sanitizeExtension(extension);
  const meta: MediaMeta = {
    originalUrl,
    mimeType,
    extension: normalizedExtension,
    createdAt: new Date().toISOString(),
  };
  await Promise.all([
    fs.promises.writeFile(
      path.join(STORAGE_DIR, `${id}.${normalizedExtension}`),
      buffer,
    ),
    fs.promises.writeFile(
      path.join(STORAGE_DIR, `${id}.json`),
      JSON.stringify(meta),
    ),
  ]);
}

export async function saveWatermarkedImage(
  id: string,
  buffer: Buffer,
  originalUrl: string,
) {
  await saveWatermarkedMedia(id, buffer, {
    originalUrl,
    mimeType: "image/png",
    extension: "png",
  });
}

async function loadMediaMeta(id: string): Promise<MediaMeta | null> {
  try {
    const raw = await fs.promises.readFile(
      path.join(STORAGE_DIR, `${id}.json`),
      "utf-8",
    );
    return JSON.parse(raw) as MediaMeta;
  } catch {
    return null;
  }
}

export async function loadWatermarkedMedia(id: string) {
  const meta = await loadMediaMeta(id);
  if (!meta) return null;
  try {
    const buffer = await fs.promises.readFile(
      path.join(STORAGE_DIR, `${id}.${meta.extension}`),
    );
    return { buffer, meta };
  } catch {
    return null;
  }
}

export async function loadWatermarkedImage(id: string) {
  const media = await loadWatermarkedMedia(id);
  return media?.buffer ?? null;
}

export async function loadOriginalUrl(id: string) {
  const meta = await loadMediaMeta(id);
  return meta?.originalUrl ?? null;
}

