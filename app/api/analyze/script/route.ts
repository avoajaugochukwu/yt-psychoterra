// ============================================================================
// SCRIPT ANALYSIS API ROUTE (TEMPLATE-BASED)
// Breaks scripts into scenes with abstract marble statue imagery (1 scene per 6 seconds)
// Uses modular template system for fast, varied image generation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateVideoScenePrompts } from '@/lib/prompts/abstract-scene-templates';

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

    // Generate abstract scene prompts using modular template system
    const visualPrompts = generateVideoScenePrompts(targetSceneCount);

    // Create scenes array with template-based prompts
    const scenes = visualPrompts.map((visualPrompt, index) => ({
      scene_number: index + 1,
      visual_prompt: visualPrompt,
      narration: '', // No narration alignment needed
    }));

    console.log(`[Script Analysis] Successfully generated ${scenes.length} template-based scenes`);

    // Create streaming response for compatibility with frontend
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // Send progress update (immediate since no API call)
        const progressMessage = {
          type: 'progress',
          text: JSON.stringify({ scenes }),
        };
        controller.enqueue(encoder.encode(JSON.stringify(progressMessage) + '\n'));

        // Send completion message
        const completeMessage = {
          type: 'complete',
          scenes: scenes,
        };
        controller.enqueue(encoder.encode(JSON.stringify(completeMessage) + '\n'));

        controller.close();
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
