import { GenerationRequest, GenerationResult, VideoModel } from "./types";

interface ApiVideoResponse {
  videoUrl?: string;
  error?: string;
}

export async function generateVideo(
  request: GenerationRequest,
): Promise<GenerationResult> {
  const {
    prompt,
    duration,
    seed,
    image,
    aspect_ratio,
    camera_fixed,
    last_frame_image,
    reference_images,
  } = request;

  const finalDuration =
    typeof duration === "number" && Number.isFinite(duration)
      ? Math.min(5, Math.max(2, duration))
      : 3;

  const payload: Record<string, unknown> = {
    prompt,
    duration: finalDuration,
    resolution: "480p",
  };

  if (typeof seed === "number" && Number.isFinite(seed)) {
    payload.seed = seed;
  }
  if (image) {
    payload.image = image;
  }
  if (aspect_ratio) {
    payload.aspect_ratio = aspect_ratio;
  }
  if (typeof camera_fixed === "boolean") {
    payload.camera_fixed = camera_fixed;
  }
  if (last_frame_image) {
    payload.last_frame_image = last_frame_image;
  }
  if (reference_images && reference_images.length > 0) {
    payload.reference_images = reference_images;
  }

  const response = await fetch("/api/generate-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData: ApiVideoResponse = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to generate video");
  }

  const data: ApiVideoResponse = await response.json();

  if (!data.videoUrl) {
    throw new Error(data.error || "Invalid response from server");
  }

  const model: VideoModel = "seedance-1-lite";
  const finalResolution = "480p";

  return {
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    videoUrl: data.videoUrl,
    prompt,
    model,
    duration: finalDuration,
    resolution: finalResolution,
    createdAt: new Date().toISOString(),
  };
}
