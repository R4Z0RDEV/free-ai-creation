export type VideoModelId = "seedance-lite";

export interface VideoModelConfig {
  id: VideoModelId;
  displayName: string;
  provider: "replicate";
  resolutions: {
    id: string;
    label: string;
    width: number;
    height: number;
  }[];
  aspectRatios: {
    id: string;
    label: string;
    value: string;
  }[];
  minDurationSeconds: number;
  maxDurationSeconds: number;
  defaultDurationSeconds: number;
}

export const VIDEO_MODELS: VideoModelConfig[] = [
  {
    id: "seedance-lite",
    displayName: "Seedance Lite",
    provider: "replicate",
    resolutions: [
      { id: "480p", label: "480p (854x480)", width: 854, height: 480 },
    ],
    aspectRatios: [
      { id: "16:9", label: "16:9 (Landscape)", value: "16:9" },
      { id: "4:3", label: "4:3", value: "4:3" },
      { id: "1:1", label: "1:1 (Square)", value: "1:1" },
      { id: "3:4", label: "3:4", value: "3:4" },
      { id: "9:16", label: "9:16 (Portrait)", value: "9:16" },
      { id: "21:9", label: "21:9", value: "21:9" },
      { id: "9:21", label: "9:21", value: "9:21" },
    ],
    minDurationSeconds: 2,
    maxDurationSeconds: 5,
    defaultDurationSeconds: 4,
  },
];

export function getVideoModelConfig(id: VideoModelId): VideoModelConfig {
  const config = VIDEO_MODELS.find((model) => model.id === id);
  if (!config) {
    throw new Error(`Video model config not found for id: ${id}`);
  }
  return config;
}

export function validateModelConstraints(
  modelId: VideoModelId,
  duration: number,
  width: number,
  height: number
): {
  duration: number;
  width: number;
  height: number;
} {
  const config = getVideoModelConfig(modelId);

  const clampedDuration = Math.max(
    config.minDurationSeconds,
    Math.min(config.maxDurationSeconds, duration)
  );

  const validResolution = config.resolutions.find(
    (r) => r.width === width && r.height === height
  );

  const finalWidth = validResolution ? width : config.resolutions[0].width;
  const finalHeight = validResolution ? height : config.resolutions[0].height;

  return {
    duration: clampedDuration,
    width: finalWidth,
    height: finalHeight,
  };
}
