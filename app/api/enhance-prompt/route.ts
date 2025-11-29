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

        const systemPrompt = `You are an expert prompt engineer for AI image generation. Your task is to take a user's raw, simple prompt and enhance it to be more descriptive, artistic, and detailed to produce a high-quality image.
    
    Rules:
    1. Keep the core meaning of the original prompt.
    2. Add artistic style, lighting, texture, and composition details.
    3. Output ONLY the enhanced prompt. Do not add any conversational text, prefixes, or suffixes.
    4. Keep it concise but potent (around 20-40 words).`;

        const input = {
            top_p: 0.9,
            prompt: `${systemPrompt}\n\nUser Prompt: ${prompt}\n\nEnhanced Prompt:`,
            min_tokens: 0,
            temperature: 0.7,
            presence_penalty: 0,
        };

        const output = await replicate.run(
            "meta/meta-llama-3-8b",
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
