// ============================================================================
// SCRIPT REWRITING API ROUTE
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '@/lib/ai/anthropic';
import { REWRITE_SCRIPT_ENHANCED_PROMPT } from '@/lib/prompts/all-prompts';
import type { ScriptAnalysisResult } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { script, analysis } = await request.json();

    if (!script || typeof script !== 'string') {
      return NextResponse.json(
        { error: 'Script text is required' },
        { status: 400 }
      );
    }

    if (!analysis || typeof analysis !== 'object') {
      return NextResponse.json(
        { error: 'Analysis results are required' },
        { status: 400 }
      );
    }

    // Call Claude API for script rewriting
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 16384, // Increased to handle longer scripts (52+ min) without truncation
      temperature: 0.7, // Slightly higher temperature for creative rewriting
      messages: [
        {
          role: 'user',
          content: REWRITE_SCRIPT_ENHANCED_PROMPT(script, analysis as ScriptAnalysisResult),
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const rewrittenScript = content.text.trim();

    return NextResponse.json({ rewritten_script: rewrittenScript });
  } catch (error) {
    console.error('Script rewriting error:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite script', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
