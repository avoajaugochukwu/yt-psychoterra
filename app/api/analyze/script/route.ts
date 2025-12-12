// ============================================================================
// SCRIPT ANALYSIS API ROUTE (OPENAI GPT-4o)
// Breaks scripts into Psychoterra marble statue scenes (1 scene per 6 seconds)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai';
import { SCENE_BREAKDOWN_PROMPT } from '@/lib/prompts/all-prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Helper to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export async function POST(request: NextRequest) {
  try {
    const { script } = await request.json();

    if (!script || typeof script !== 'string') {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    if (script.length < 50) {
      return NextResponse.json(
        { error: 'Script is too short. Please provide at least 50 characters.' },
        { status: 400 }
      );
    }

    // Calculate target scene count: 1 scene per 6 seconds
    const wordCount = countWords(script);
    const estimatedMinutes = wordCount / 150; // 150 words per minute (standard speaking rate)
    const estimatedSeconds = estimatedMinutes * 60;
    const targetSceneCount = Math.round(estimatedSeconds / 6); // 6 seconds per scene

    console.log(`[Script Analysis] Word count: ${wordCount}, Estimated duration: ${estimatedSeconds}s, Target scenes: ${targetSceneCount}`);

    // Call OpenAI GPT-4o with SCENE_BREAKDOWN_PROMPT
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a visual director for Stoic philosophy content. You transform abstract concepts into metaphorical marble statue imagery. You NEVER depict literal human actions - only stone sculptures and symbolic elements.',
        },
        {
          role: 'user',
          content: SCENE_BREAKDOWN_PROMPT(script, targetSceneCount),
        },
      ],
      temperature: 0.7,
      max_tokens: 16000,
      response_format: { type: 'json_object' }, // Ensure JSON output
      stream: true,
    });

    // Create streaming response with newline-delimited JSON
    const encoder = new TextEncoder();
    let accumulatedContent = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              accumulatedContent += content;

              // Send progress update
              const progressMessage = {
                type: 'progress',
                text: accumulatedContent,
              };
              controller.enqueue(encoder.encode(JSON.stringify(progressMessage) + '\n'));
            }
          }

          // Parse the final accumulated JSON
          try {
            const parsedResult = JSON.parse(accumulatedContent);

            // Validate the response has the expected structure
            if (!parsedResult.scenes || !Array.isArray(parsedResult.scenes)) {
              throw new Error('Invalid response format: missing scenes array');
            }

            // Send completion message
            const completeMessage = {
              type: 'complete',
              scenes: parsedResult.scenes,
            };
            controller.enqueue(encoder.encode(JSON.stringify(completeMessage) + '\n'));

            console.log(`[Script Analysis] Successfully generated ${parsedResult.scenes.length} scenes`);
          } catch (parseError) {
            console.error('[Script Analysis] Error parsing OpenAI response:', parseError);
            const errorMessage = {
              type: 'error',
              error: 'Failed to parse scene breakdown response',
            };
            controller.enqueue(encoder.encode(JSON.stringify(errorMessage) + '\n'));
          }

          controller.close();
        } catch (error) {
          console.error('[Script Analysis] Stream error:', error);
          const errorMessage = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown streaming error',
          };
          controller.enqueue(encoder.encode(JSON.stringify(errorMessage) + '\n'));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[Script Analysis] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze script',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
