// ============================================================================
// TTS FORMATTING API ROUTE (OPENAI)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { openai, TTS_MODEL, TTS_TEMPERATURE, TTS_MAX_TOKENS } from '@/lib/ai/openai';
import { FORMAT_FOR_TTS_PROMPT } from '@/lib/prompts/all-prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script || typeof script !== 'string') {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    if (script.length < 10) {
      return NextResponse.json(
        { error: 'Script is too short to format' },
        { status: 400 }
      );
    }

    // Call OpenAI API for TTS formatting with streaming
    const stream = await openai.chat.completions.create({
      model: TTS_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert voiceover script formatter. You preserve every word exactly but improve line breaks and paragraph structure for natural speech delivery.',
        },
        {
          role: 'user',
          content: FORMAT_FOR_TTS_PROMPT(script),
        },
      ],
      temperature: TTS_TEMPERATURE,
      max_tokens: TTS_MAX_TOKENS,
      stream: true,
    });

    // Create a ReadableStream to stream the response to the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('TTS formatting error:', error);
    return NextResponse.json(
      { error: 'Failed to format script for TTS', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
