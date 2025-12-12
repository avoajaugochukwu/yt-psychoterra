// ============================================================================
// OPENAI CLIENT CONFIGURATION
// ============================================================================

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default configuration for TTS formatting
export const TTS_MODEL = 'gpt-4o';
export const TTS_TEMPERATURE = 0.3; // Lower temperature for more consistent formatting
export const TTS_MAX_TOKENS = 16000; // Support for longer scripts
