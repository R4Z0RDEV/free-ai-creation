/**
 * Google Gemini Veo 2 Video Generation Utilities
 *
 * This module handles video generation with Google's Veo 2 model via the Gemini API:
 * 1. Create a video generation operation
 * 2. Poll the operation status until completion
 * 3. Download the generated video
 * 4. Convert to base64 for client consumption
 */

export interface VeoGenerationRequest {
  prompt: string;
  seconds?: number;
  width?: number;
  height?: number;
  resolution?: '720p' | '1080p';
}

export interface VeoGenerationResponse {
  ok: boolean;
  videoBase64?: string;
  mimeType?: string;
  jobId?: string;
  generationId?: string;
  error?: string;
}

interface VeoOperation {
  name: string;
  done?: boolean;
  error?: {
    code: number;
    message: string;
  };
  response?: {
    generatedVideo?: {
      uri?: string;
      content?: string;
    };
  };
  metadata?: {
    '@type': string;
    [key: string]: any;
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
 * Complete workflow: Create operation → Poll → Download → Convert to base64
 */
export async function generateVeoVideo(
  request: VeoGenerationRequest
): Promise<VeoGenerationResponse> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = process.env.GEMINI_VEO_ENDPOINT;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    if (!endpoint) {
      throw new Error('GEMINI_VEO_ENDPOINT is not set');
    }

    const { prompt, seconds = 4, width = 1280, height = 720 } = request;

    const durationSeconds = Math.min(Math.max(seconds, 1), 16);

    const aspectRatio = width >= height ? '16:9' : '9:16';

    console.log('=== Gemini Veo 2 Video Generation ===');
    console.log('Endpoint:', endpoint);
    console.log('Prompt:', prompt);
    console.log('Duration:', durationSeconds, 'seconds');
    console.log('Aspect Ratio:', aspectRatio);

    const url = `${endpoint}?key=${encodeURIComponent(apiKey)}`;

    console.log('Veo request URL:', url);

    const requestBody = {
      prompt: {
        text: prompt,
      },
      config: {
        durationSeconds,
        aspectRatio,
      },
    };

    console.log('Veo request body:', JSON.stringify(requestBody, null, 2));

    const createResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Veo create error', createResponse.status, errorText);
      return {
        ok: false,
        error: `Veo error ${createResponse.status}: ${errorText}`,
      };
    }

    const operationData: VeoOperation = await createResponse.json();
    const operationName = operationData.name;

    if (!operationName) {
      throw new Error('No operation name returned from Gemini Veo API');
    }

    console.log('Operation created:', operationName);

    const maxAttempts = 40;
    const intervalMs = 5000;

    console.log('Polling operation status...');

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));

      const statusUrl = `https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${encodeURIComponent(
        apiKey
      )}`;

      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Failed to poll operation status:', statusResponse.status, errorText);
        return {
          ok: false,
          error: `Veo error ${statusResponse.status}: ${errorText}`,
        };
      }

      const operation: VeoOperation = await statusResponse.json();
      console.log(
        `Attempt ${attempt + 1}/${maxAttempts}: Done = ${operation.done}, Error = ${!!operation.error}`
      );

      if (operation.error) {
        const errorMsg = operation.error.message || 'Unknown error';
        console.error('Operation failed:', errorMsg);
        return {
          ok: false,
          error: `Veo error ${operation.error.code}: ${errorMsg}`,
        };
      }

      if (operation.done && operation.response) {
        console.log('Operation succeeded!');

        const generatedVideo = operation.response.generatedVideo;
        if (!generatedVideo) {
          throw new Error('No generated video in response');
        }

        let videoBuffer: ArrayBuffer;

        if (generatedVideo.content) {
          console.log('Video content returned as base64');
          const base64Data = generatedVideo.content;
          const binaryString = Buffer.from(base64Data, 'base64');
          videoBuffer = binaryString.buffer.slice(
            binaryString.byteOffset,
            binaryString.byteOffset + binaryString.byteLength
          );
        } else if (generatedVideo.uri) {
          console.log('Video URI returned:', generatedVideo.uri);

          const downloadUrl = generatedVideo.uri.includes('?')
            ? `${generatedVideo.uri}&key=${encodeURIComponent(apiKey)}`
            : `${generatedVideo.uri}?key=${encodeURIComponent(apiKey)}`;

          console.log('Downloading video from URI...');

          const downloadResponse = await fetch(downloadUrl);

          if (!downloadResponse.ok) {
            const errorText = await downloadResponse.text();
            console.error('Failed to download video:', downloadResponse.status, errorText);
            return {
              ok: false,
              error: `Veo error ${downloadResponse.status}: ${errorText}`,
            };
          }

          videoBuffer = await downloadResponse.arrayBuffer();
        } else {
          throw new Error('No video content or URI in response');
        }

        console.log('Video downloaded:', videoBuffer.byteLength, 'bytes');

        const videoBase64 = arrayBufferToBase64(videoBuffer);
        console.log('Video converted to base64:', videoBase64.length, 'characters');

        return {
          ok: true,
          videoBase64,
          mimeType: 'video/mp4',
          jobId: operationName,
          generationId: operationName,
        };
      }
    }

    console.error('Operation timed out after', maxAttempts, 'attempts');
    return {
      ok: false,
      error: 'Veo generation timed out: exceeded maximum polling attempts',
    };
  } catch (error) {
    console.error('Error in generateVeoVideo:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      ok: false,
      error: `Veo generation failed: ${errorMessage}`,
    };
  }
}
