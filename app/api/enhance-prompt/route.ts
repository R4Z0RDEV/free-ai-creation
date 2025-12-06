import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    if (!process.env.REPLICATE_API_TOKEN) {
        return NextResponse.json(
            { error: 'Replicate API token not configured' },
            { status: 500 }
        );
    }

    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const input = {
            top_p: 0.9,
            prompt: `You are an expert prompt engineer for AI image generation. Take the user's simple prompt and enhance it to be more descriptive and artistic for high-quality image generation.

Rules:
- Keep the core meaning of the original prompt
- Add artistic style, lighting, texture, and composition details
- Output ONLY the enhanced prompt text, nothing else - no code, no explanations, no prefixes
- Keep it concise (20-40 words)

User's prompt: "${prompt}"

Enhanced version:`,
            min_tokens: 0,
            temperature: 0.7,
            presence_penalty: 0,
            max_tokens: 150,
        };

        const output = await replicate.run(
            "meta/meta-llama-3-8b-instruct",
            { input }
        );

        // The output from Replicate for this model is typically an array of strings (tokens)
        const enhancedPrompt = Array.isArray(output) ? output.join('').trim() : String(output).trim();

        return NextResponse.json({ enhancedPrompt });
    } catch (error) {
        console.error('Prompt enhancement error:', error);
        return NextResponse.json(
            { error: 'Failed to enhance prompt' },
            { status: 500 }
        );
    }
}
