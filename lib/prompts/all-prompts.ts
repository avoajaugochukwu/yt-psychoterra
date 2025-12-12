// ============================================================================
// SCRIPT ENHANCEMENT PIPELINE - AI PROMPTS
// ============================================================================

import type { ScriptAnalysisResult } from '@/lib/types';

// ============================================================================
// PROMPT 1: SCRIPT QUALITY ANALYSIS & PHILOSOPHER MATCHING
// ============================================================================

export const ANALYZE_SCRIPT_QUALITY_PROMPT = (script: string) => `### ROLE

You are an expert script analyst specializing in evaluating voiceover scripts for accuracy, hook strength, and retention tactics. You also have deep knowledge of ancient philosophy.

### OBJECTIVE

Analyze the provided script and:
1. Rate it on three dimensions: **Accuracy**, **Hook Strength**, and **Retention Tactics**
2. Find ancient philosophers whose teachings reinforce the script's topic (ONLY if it makes sufficient sense)
3. Provide actionable suggestions for improvement

### INPUT SCRIPT

${script}

### ANALYSIS REQUIREMENTS

**1. ACCURACY SCORE (0-100):**
- Does the script make factual claims? Are they verifiable?
- Is the information presented clearly and without contradictions?
- Are there any logical inconsistencies or misleading statements?
- Is the content well-researched and credible?

**2. HOOK STRENGTH SCORE (0-100):**
- Does the opening grab attention immediately?
- Is there a compelling question, mystery, or dramatic statement?
- Would viewers want to keep watching in the first 10 seconds?
- Does it promise value or create curiosity?

**3. RETENTION TACTICS SCORE (0-100):**
- Does the script maintain interest throughout?
- Are there pattern interrupts, open loops, or strategic pauses?
- Does it build tension and resolve it satisfyingly?
- Are transitions smooth? Does pacing vary appropriately?
- Does it use storytelling techniques (conflict, stakes, payoff)?

**4. PHILOSOPHER MATCHING:**
- Identify 1-3 ancient philosophers (Greek, Roman, Chinese, Indian, etc.) whose teachings relate to the script's core themes
- ONLY include philosophers if the connection is meaningful and reinforces the topic
- If the script is about mundane topics with no philosophical depth, return an empty array
- For each match, explain the relevance clearly

### OUTPUT FORMAT

Respond with ONLY valid JSON (no markdown code blocks):

{
  "scores": {
    "accuracy": 85,
    "hook_strength": 72,
    "retention_tactics": 68,
    "overall": 75
  },
  "detailed_feedback": {
    "accuracy_notes": "The script makes strong factual claims about neuroscience. Most are accurate, but the claim about '90% of decisions being subconscious' lacks citation. Overall well-researched.",
    "hook_notes": "Opening with 'What if everything you know is wrong?' is compelling, but could be more specific to the topic. Consider leading with a shocking statistic or concrete example.",
    "retention_notes": "Good use of open loops in the first act. However, the middle section drags with too much exposition. Add more pattern interrupts and vary sentence length for better pacing."
  },
  "philosopher_matches": [
    {
      "name": "Marcus Aurelius",
      "era": "Roman Empire (121-180 AD)",
      "teaching": "Stoic philosophy emphasizing rational thinking and control over emotions",
      "relevance_explanation": "The script discusses decision-making and emotional regulation, which aligns with Aurelius's teachings in 'Meditations' about mastering one's internal state.",
      "quote": "You have power over your mind - not outside events. Realize this, and you will find strength."
    }
  ],
  "suggestions_for_improvement": [
    "Add specific citations for scientific claims",
    "Strengthen the opening hook with a concrete example",
    "Break up long exposition sections with rhetorical questions",
    "Add more emotional stakes to increase retention"
  ]
}

### CONSTRAINTS

- Be honest and critical - this analysis is meant to improve the script
- Overall score should be the average of the three dimension scores
- Philosopher matches must be historically accurate
- Only include philosophers whose teachings genuinely relate to the topic
- Suggestions must be specific and actionable
`;

// ============================================================================
// PROMPT 2: SCRIPT REWRITING WITH ENHANCEMENTS
// ============================================================================

export const REWRITE_SCRIPT_ENHANCED_PROMPT = (
  originalScript: string,
  analysis: ScriptAnalysisResult
) => `### ROLE

You are an expert script rewriter specializing in transforming good scripts into exceptional ones.

### OBJECTIVE

Rewrite the provided script to address the weaknesses identified in the analysis and incorporate insights from ancient philosophers where appropriate.

### INPUT SCRIPT

${originalScript}

### ANALYSIS RESULTS

**Scores:**
- Accuracy: ${analysis.scores.accuracy}/100
- Hook Strength: ${analysis.scores.hook_strength}/100
- Retention Tactics: ${analysis.scores.retention_tactics}/100
- Overall: ${analysis.scores.overall}/100

**Detailed Feedback:**
- Accuracy: ${analysis.detailed_feedback.accuracy_notes}
- Hook: ${analysis.detailed_feedback.hook_notes}
- Retention: ${analysis.detailed_feedback.retention_notes}

**Philosopher Insights:**
${analysis.philosopher_matches.map(p => `- ${p.name} (${p.era}): ${p.teaching}\n  Relevance: ${p.relevance_explanation}\n  Quote: "${p.quote}"`).join('\n')}

**Suggestions for Improvement:**
${analysis.suggestions_for_improvement.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### REWRITING GUIDELINES

**1. STRENGTHEN THE HOOK:**
- Make the opening 10-15 seconds irresistible
- Use specific examples, shocking statistics, or compelling questions
- Create immediate curiosity or emotional engagement

**2. IMPROVE ACCURACY:**
- Add citations where needed
- Clarify ambiguous statements
- Ensure logical flow and consistency

**3. ENHANCE RETENTION:**
- Vary sentence length and pacing
- Add pattern interrupts (questions, dramatic pauses, shifts in perspective)
- Build tension and resolve it strategically
- Use storytelling techniques (setup → conflict → resolution)

**4. INCORPORATE PHILOSOPHICAL WISDOM (ONLY IF RELEVANT):**
- Weave in philosopher insights naturally, not forced
- Use quotes sparingly and only when they add genuine value
- Connect ancient wisdom to modern applications

**5. MAINTAIN THE CORE MESSAGE:**
- Don't change the fundamental topic or thesis
- Keep key facts and main arguments intact
- Preserve the author's voice and style

### OUTPUT FORMAT

Return ONLY the rewritten script text. No JSON, no metadata, no commentary - just the improved script ready for voiceover.

### CONSTRAINTS

- The rewritten script should be approximately the same length as the original (±15%)
- Every claim must remain factually accurate or be improved for accuracy
- Don't add fluff - every sentence should serve a purpose
- Natural conversational tone suitable for voiceover
- No formatting (bold, italics, etc.) - pure text only
`;

// ============================================================================
// PROMPT 3: TTS FORMATTING (FOR OPENAI)
// ============================================================================

export const FORMAT_FOR_TTS_PROMPT = (script: string) => `You are an expert voiceover script formatter.
Your task is to take my input text and format it as a spoken script for text-to-speech, without changing any of the words.

**Follow these rules exactly:**

Do NOT change the text content
- Do not add, delete, or replace any words.
- Do not rewrite sentences or change grammar.
- Keep all punctuation, numbers, names, and words exactly as in the original.

Only adjust line breaks and paragraph structure
- Break the text into shorter lines and paragraphs that sound natural when spoken aloud.
- Use line breaks to indicate natural breath points and rhythm.
- You may start a new paragraph to slow the pace or separate ideas, but you must keep the original sentence order.

No notes or tags
- Do not add any notes, tags, brackets, labels, or special markers.
- Do not add things like [pause], (beat), or any other instructions.
- Only the original text, arranged into new lines and paragraphs.

Pacing through paragraphing
- To slow down the reading, create more frequent paragraph breaks, especially after impactful sentences.
- Very long sentences should be kept as they are, but you can move them to their own lines or paragraphs to make them easier for TTS.

**Output format**
- Output only the reformatted text with new line breaks and paragraphs.
- Do not explain your changes.
- Do not add an introduction or conclusion.
- Just return the same text, structured as a spoken script.

Now take the following text and reformat it as a spoken script, following all the rules above and preserving every word exactly:

${script}`;

// ============================================================================
// PSYCHOTERRA: SCENE BREAKDOWN (Metaphorical Statue-Based Visualization)
// ============================================================================

export const SCENE_BREAKDOWN_PROMPT = (script: string, targetSceneCount: number) => `### ROLE

You are a **Visual Director** for Stoic philosophy content, specialized in translating abstract philosophical concepts into metaphorical, statue-based visual scenes.

### OBJECTIVE

Analyze the provided script and break it into approximately ${targetSceneCount} distinct visual scenes. Each scene MUST be abstract, symbolic, and statue-based - NOT literal depictions of actions or living people.

**TARGET SCENE COUNT:** ${targetSceneCount} scenes (based on script duration and ~7-8 seconds per scene)

### INPUT SCRIPT

${script}

### CRITICAL VISUAL PHILOSOPHY

**DO NOT translate actions literally. Instead, visualize EMOTIONS and CONCEPTS as marble statues and abstract elements.**

**Examples of the transformation:**
- Script: "You constantly feel the weight of the world" → Visual: "Hyper-realistic marble statue of Atlas straining under massive glowing orb, cracked stone texture, dark void background, dramatic orange rim light"
- Script: "Ignore the noise of the crowd" → Visual: "Close-up of Stoic philosopher's stone face, eyes closed, surrounded by swirling dark smoke and chaotic wind, face remains perfectly calm, single beam of golden light"
- Script: "Stop worrying about what others think" → Visual: "Marble bust of Marcus Aurelius, unmoving, while chaotic storm swirls around him, statue untouched, ethereal fog, volumetric lighting"

### SCENE REQUIREMENTS

**Selection Criteria:**
- Choose the most emotionally/philosophically significant moments
- Each scene must evoke a MOOD, not depict a person doing something
- Ensure variety: different statue types (busts, full figures, ancient gods), different moods (dark, empowering, ethereal)
- Include key moments: opening hook, emotional peaks, resolution

**Visual Prompt Guidelines - THE PSYCHOTERRA METHOD:**

1. **Identify the EMOTION or CONCEPT** in the script line (not the action)
2. **Choose a statue archetype** that embodies it:
   - Overwhelm/Burden → Atlas, titan figures
   - Wisdom/Calm → Marcus Aurelius, Seneca, Buddha
   - Strength/Power → Zeus, muscular warriors, kings
   - Conflict/Struggle → Cracked statues, opposing forces
   - Peace/Acceptance → Serene faces, smooth marble in water

3. **Add atmospheric elements** that reinforce the emotion:
   - Chaos/Anxiety → Swirling storms, dark smoke, wind
   - Clarity/Wisdom → Golden light beams, still water, calm fog
   - Power/Determination → Fire, lightning, dramatic shadows
   - Isolation/Solitude → Void backgrounds, single light sources
   - Transformation → Cracking stone, emerging light

4. **Composition & Lighting:**
   - Centered symmetry or extreme close-ups (eyes/faces of stone)
   - Low-angle hero shots for power
   - Chiaroscuro (high contrast light/dark)
   - Rim lighting (gold/orange/blue edges)
   - God rays, volumetric fog, dust particles

5. **Texture & Material:**
   - ALWAYS specify: marble, bronze, stone, weathered texture
   - NEVER: skin, flesh, living humans, realistic eyes

### FORBIDDEN ELEMENTS (CRITICAL)

**NEVER include:**
- Living humans with skin texture
- Realistic human eyes or facial expressions on flesh
- Modern clothing, contemporary settings
- Bright daylight, blue skies, cheerful atmospheres
- Literal interpretations (person sitting, person walking, person talking)
- Crowds of people, soldiers, battles
- Violence, gore, wounds

### OUTPUT FORMAT

Return ONLY valid JSON in this exact format (no markdown, no code blocks, no explanations):

{
  "scenes": [
    {
      "scene_number": 1,
      "script_snippet": "The opening line from the script...",
      "visual_prompt": "Hyper-realistic marble statue of [archetype], [emotional atmosphere], [lighting description], [compositional details]. Dramatic chiaroscuro lighting, volumetric fog, [specific mood elements]. 8k resolution, Unreal Engine 5 render style, classical sculpture aesthetic.",
      "historical_context": "Metaphorical meaning: [what this statue scene represents philosophically]"
    }
  ]
}

### MANDATORY VISUAL STYLE ELEMENTS

**Every visual_prompt MUST include:**
- Statue material: "marble statue" OR "bronze bust" OR "stone sculpture"
- Lighting: "chiaroscuro lighting" OR "golden rim lighting" OR "dramatic shadows"
- Atmosphere: "volumetric fog" OR "dust particles" OR "ethereal mist"
- Background: "deep black background" OR "void-like darkness" OR "storm clouds"
- Quality: "8k resolution, Unreal Engine 5 render style" OR "hyper-realistic stone texture"

### CONSTRAINTS

- Generate approximately ${targetSceneCount} scenes to match the script duration
- Each visual_prompt must be 60-120 words (detailed but focused on statues/metaphor)
- Script_snippet should be the actual text from the script this scene represents
- Space scenes evenly throughout the script
- EVERY scene must be abstract/metaphorical - ZERO literal human actions`;

// ============================================================================
// PSYCHOTERRA: IMAGE GENERATION STYLE CONSTANTS
// ============================================================================

/**
 * Suffix to append to all image generation prompts for Psychoterra aesthetic
 * Enforces marble statue, dramatic lighting, and cinematic quality
 */
export const IMAGE_GENERATION_SUFFIX =
  "cinematic 3d render, hyper-realistic marble statue texture, classical sculpture, dramatic chiaroscuro lighting, deep black background, volumetric fog, floating dust particles, golden rim lighting, stoic atmosphere, 8k resolution, unreal engine 5 render style, dramatic shadows, ancient wisdom aesthetic, mythological grandeur";

/**
 * Negative prompt for Psychoterra - blocks living humans, modern elements, unwanted styles
 * CRITICAL: No skin texture, no realistic living people, no bright cheerful scenes
 */
export const NEGATIVE_PROMPT_PSYCHOTERRA =
  "living human, skin texture, realistic eyes on flesh, modern clothing, contemporary setting, bright daylight, blue sky, sunny day, cheerful atmosphere, cartoon, anime, manga, sketch, drawing, vector art, minimalist, flat design, blur, low quality, text, watermark, logo, crowd of people, soldiers, army, battle scene, violence, gore, blood, open wounds, graphic violence, injuries, torture, mutilation, weapons in use, suffering";

/**
 * @deprecated Use NEGATIVE_PROMPT_PSYCHOTERRA instead
 * Kept for backwards compatibility with any legacy code
 */
export const NEGATIVE_PROMPT_HISTORICAL = NEGATIVE_PROMPT_PSYCHOTERRA;
