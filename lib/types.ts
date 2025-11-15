export type VideoModel = 'seedance-1-lite';
export type ClipStatus = 'idle' | 'generating' | 'ready' | 'error';
export type Resolution = '480p' | '720p' | '1080p';

export interface GenerationRequest {
  prompt: string;
  model: VideoModel;
  duration: number;
  resolution: string;
  seed?: number;
  image?: string;
  aspect_ratio?: string;
  camera_fixed?: boolean;
  last_frame_image?: string;
  reference_images?: string[];
}

export interface GenerationResult {
  id: string;
  videoUrl: string;
  prompt: string;
  model: VideoModel;
  duration: number;
  resolution: string;
  createdAt: string;
}

export interface GenerationHistory extends GenerationResult {
  thumbnailUrl?: string;
}

export interface Clip {
  id: string;
  title: string;
  prompt: string;
  duration: number;
  resolution: Resolution;
  model: VideoModel;
  status: ClipStatus;
  videoUrl?: string;
  errorMessage?: string;
  // Optional per-clip advanced video options for Replicate Seedance Lite
  seed?: number;
  image?: string;
  aspect_ratio?: string;
  camera_fixed?: boolean;
  last_frame_image?: string;
  reference_images?: string[];
}

export interface Project {
  id: string;
  name: string;
  clips: Clip[];
  createdAt: string;
  updatedAt: string;
}
