// ============================================================================
// SCRIPT QUALITY ANALYSIS API ROUTE
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { anthropic, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '@/lib/ai/anthropic';
import { ANALYZE_SCRIPT_QUALITY_PROMPT } from '@/lib/prompts/all-prompts';
import type { ScriptAnalysisResult } from '@/lib/types';

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

    if (script.length < 50) {
      return NextResponse.json(
        { error: 'Script is too short to analyze (minimum 50 characters)' },
        { status: 400 }
      );
    }

    // Call Claude API for script analysis
    const response = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: ANALYZE_SCRIPT_QUALITY_PROMPT(script),
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    let analysisResult: Omit<ScriptAnalysisResult, 'generated_at'>;
    try {
      // Remove markdown code blocks if present
      const cleanedText = content.text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', content.text);
      return NextResponse.json(
        { error: 'Failed to parse analysis results', details: content.text },
        { status: 500 }
      );
    }

    // Add timestamp
    const finalResult: ScriptAnalysisResult = {
      ...analysisResult,
      generated_at: new Date(),
    };

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error('Script analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze script', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
