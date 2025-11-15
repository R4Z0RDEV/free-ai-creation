/**
 * Azure OpenAI Sora Video Generation Utilities
 *
 * This module handles the complete workflow for generating videos with Azure Sora:
 * 1. Create a video generation job
 * 2. Poll the job status until completion
 * 3. Download the generated video as binary data
 * 4. Convert to base64 for client consumption
 */

export interface VideoGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  seconds?: number;
}

export interface VideoGenerationResponse {
  ok: boolean;
  videoBase64?: string;
  mimeType?: string;
  jobId?: string;
  generationId?: string;
  error?: string;
}

interface VideoGenerationJob {
  id: string;
  status: string;
  generations?: Array<{
    id: string;
    status: string;
  }>;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Helper: Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return Buffer.from(binary, 'binary').toString('base64');
}

/**
 * Complete workflow: Create job → Poll → Download → Convert to base64
 */
export async function generateVideo(
  request: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  try {
    const rawEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    if (!rawEndpoint) {
      throw new Error('AZURE_OPENAI_ENDPOINT is not set');
    }
    const endpoint = rawEndpoint.replace(/\/$/, '');

    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY is not set');
    }

    const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? '2025-01-01-preview';
    const model = process.env.AZURE_OPENAI_SORA_MODEL ?? 'sora';

    const { prompt, width = 720, height = 1280, seconds = 4 } = request;

    console.log('=== Azure Sora Video Generation ===');
    console.log('Endpoint:', endpoint);
    console.log('API Version:', apiVersion);
    console.log('Model:', model);
    console.log('Prompt:', prompt);
    console.log('Dimensions:', `${width}x${height}`);
    console.log('Duration:', `${seconds}s`);

    const createJobUrl = `${endpoint}/openai/v1/video/generations/jobs?api-version=${apiVersion}`;
    console.log('Create Job URL:', createJobUrl);

    const createBody = {
      prompt,
      width,
      height,
      n_seconds: seconds,
      model,
    };

    console.log('Request body:', JSON.stringify(createBody, null, 2));

    const createResponse = await fetch(createJobUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(createBody),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Failed to create video job:', createResponse.status, errorText);
      throw new Error(`Failed to create video job: ${createResponse.status} ${errorText}`);
    }

    const jobData = await createResponse.json();
    const jobId = jobData.id;

    if (!jobId) {
      throw new Error('No job ID returned from Azure Sora API');
    }

    console.log('Job created with ID:', jobId);

    const statusUrl = `${endpoint}/openai/v1/video/generations/jobs/${jobId}?api-version=${apiVersion}`;
    const maxAttempts = 40;
    const intervalMs = 5000;

    console.log('Polling job status...');

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));

      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Failed to poll job status:', statusResponse.status, errorText);
        throw new Error(`Failed to poll job status: ${statusResponse.status} ${errorText}`);
      }

      const job: VideoGenerationJob = await statusResponse.json();
      console.log(`Attempt ${attempt + 1}/${maxAttempts}: Status = ${job.status}`);

      if (job.status === 'succeeded') {
        console.log('Job succeeded!');

        if (!job.generations || job.generations.length === 0) {
          throw new Error('No generations returned from completed job');
        }

        const generationId = job.generations[0].id;
        console.log('Generation ID:', generationId);

        const downloadUrl = `${endpoint}/openai/v1/video/generations/${generationId}/content/video?api-version=${apiVersion}`;
        console.log('Downloading video from:', downloadUrl);

        const downloadResponse = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
          },
        });

        if (!downloadResponse.ok) {
          const errorText = await downloadResponse.text();
          console.error('Failed to download video:', downloadResponse.status, errorText);
          throw new Error(`Failed to download video: ${downloadResponse.status} ${errorText}`);
        }

        const videoBuffer = await downloadResponse.arrayBuffer();
        console.log('Video downloaded:', videoBuffer.byteLength, 'bytes');

        const videoBase64 = arrayBufferToBase64(videoBuffer);
        console.log('Video converted to base64:', videoBase64.length, 'characters');

        return {
          ok: true,
          videoBase64,
          mimeType: 'video/mp4',
          jobId,
          generationId,
        };
      }

      if (job.status === 'failed' || job.status === 'cancelled') {
        const errorMsg = job.error?.message || 'Unknown error';
        console.error('Job failed:', errorMsg);
        return {
          ok: false,
          error: `Video generation ${job.status}: ${errorMsg}`,
        };
      }
    }

    console.error('Job timed out after', maxAttempts, 'attempts');
    return {
      ok: false,
      error: 'Video generation timed out: exceeded maximum polling attempts',
    };
  } catch (error) {
    console.error('Error in generateVideo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      ok: false,
      error: errorMessage,
    };
  }
}
