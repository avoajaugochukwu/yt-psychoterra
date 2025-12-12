# Psychoterra - Stoic Philosophy Content Engine

An AI-powered script enhancement and visual generation tool for creating Stoic psychology content with metaphorical, statue-based imagery.

## Features

### 1. Script Quality Analysis
- **Accuracy Scoring**: Evaluates factual claims and logical consistency
- **Hook Strength**: Analyzes opening effectiveness and attention-grabbing potential
- **Retention Tactics**: Assesses pacing, pattern interrupts, and storytelling techniques
- **Philosopher Matching**: Finds ancient philosophers whose teachings reinforce your topic

### 2. Intelligent Rewriting
- Strengthens weak hooks with compelling openings
- Improves retention through better pacing and structure
- Incorporates philosophical wisdom when relevant
- Maintains your core message and voice

### 3. TTS Formatting
- Formats scripts for natural text-to-speech delivery
- Preserves every word exactly (no content changes)
- Optimizes line breaks and paragraph structure for voiceover
- Uses OpenAI GPT-4 for precise formatting

### 4. Psychoterra Visual Generation ✨
**Metaphorical Statue-Based Scene Creation**
- Transforms abstract philosophical concepts into marble statue imagery
- NO literal human depictions - only stone sculptures and abstract elements
- Dramatic cinematic aesthetics: chiaroscuro lighting, volumetric fog, Unreal Engine 5 style
- Inspired by channels like "Stoic Bond" and "Motiversity"

**Visual Style:**
- 🗿 Marble statues, bronze busts, classical sculptures (Atlas, Marcus Aurelius, Zeus)
- 🌫️ Dark moody atmospheres with volumetric fog and dust particles
- ✨ Dramatic lighting: golden rim lighting, god rays, deep shadows
- 🎨 Hyper-realistic 3D renders (8k, Unreal Engine aesthetic)

**Example Transformations:**
- Script: "You feel overwhelmed" → Visual: "Atlas statue straining under glowing orb, cracked stone, dramatic lighting"
- Script: "Ignore the noise" → Visual: "Stoic philosopher's stone face, eyes closed, storm swirling around, untouched and calm"

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **Claude Sonnet 4** (Anthropic) - Script analysis and rewriting
- **GPT-4 Turbo** (OpenAI) - TTS formatting
- **Fal.ai** (Optional) - Scene image generation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys from:
  - [Anthropic](https://console.anthropic.com/) (required)
  - [OpenAI](https://platform.openai.com/) (required)
  - [Fal.ai](https://fal.ai/) (optional, for scene generation)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd yt-psychoterra
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
FAL_KEY=your_fal_api_key_here  # Optional
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Workflow

1. **Upload Script**: Paste your script into the text area (minimum 50 characters)
2. **Automatic Enhancement**: The pipeline runs automatically:
   - Analyzes quality and finds relevant philosophers
   - Rewrites the script with improvements
   - Formats for TTS delivery
3. **Review Results**: View quality scores, philosopher insights, and enhanced scripts
4. **Export**: Copy the enhanced script or proceed to scene generation

### Example Use Case: Stoic Content Creation

Input a YouTube script about overcoming anxiety, and Psychoterra will:
- Rate its accuracy, hook strength, and retention tactics
- Find philosophers like Marcus Aurelius (Stoicism) or Epictetus (emotional control)
- Rewrite it with stronger hooks and better pacing
- Format it for natural voiceover delivery
- **Generate metaphorical statue-based visuals** instead of literal scenes:
  - "You feel anxious" → Cracked marble statue with storm clouds swirling, dramatic lighting
  - "Find inner peace" → Serene stone Buddha face in still water, golden light rays

## Project Structure

```
/app
  /api
    /analyze/script-quality    # Claude-powered analysis
    /enhance/rewrite-script    # Claude-powered rewriting
    /format/tts                # OpenAI-powered TTS formatting
  /scripting                   # Main enhancement UI
  /scenes                      # Scene generation (optional)
  /export                      # Export functionality
/lib
  /ai                          # AI client configurations
  /prompts                     # Prompt engineering
  /types                       # TypeScript definitions
  /store.ts                    # Zustand state management
```

## API Routes

### `POST /api/analyze/script-quality`
Analyzes script quality and finds relevant philosophers.

**Request:**
```json
{
  "script": "Your script text here..."
}
```

**Response:**
```json
{
  "scores": {
    "accuracy": 85,
    "hook_strength": 72,
    "retention_tactics": 68,
    "overall": 75
  },
  "philosopher_matches": [...],
  "suggestions_for_improvement": [...]
}
```

### `POST /api/enhance/rewrite-script`
Rewrites the script with improvements.

**Request:**
```json
{
  "script": "Original script...",
  "analysis": { /* ScriptAnalysisResult */ }
}
```

**Response:**
```json
{
  "rewritten_script": "Enhanced script..."
}
```

### `POST /api/format/tts`
Formats script for TTS delivery (preserves every word).

**Request:**
```json
{
  "script": "Script to format..."
}
```

**Response:**
```json
{
  "formatted_script": "Formatted script with optimized line breaks..."
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for analysis and rewriting |
| `OPENAI_API_KEY` | Yes | OpenAI API key for TTS formatting |
| `FAL_KEY` | No | Fal.ai API key for image generation |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI GPT-4](https://openai.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
