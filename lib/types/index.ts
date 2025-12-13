// ============================================================================
// SCRIPT ENHANCEMENT PIPELINE - TYPES
// ============================================================================

// Script Enhancement Pipeline
export interface PhilosopherMatch {
  name: string;
  era: string;
  teaching: string;
  relevance_explanation: string;
  quote?: string;
}

export interface ScriptQualityScores {
  accuracy: number; // 0-100
  hook_strength: number; // 0-100
  retention_tactics: number; // 0-100
  overall: number; // Average of the three
}

export interface ScriptAnalysisResult {
  scores: ScriptQualityScores;
  detailed_feedback: {
    accuracy_notes: string;
    hook_notes: string;
    retention_notes: string;
  };
  philosopher_matches: PhilosopherMatch[];
  suggestions_for_improvement: string[];
  generated_at: Date;
}

export interface EnhancedScript {
  original_content: string;
  rewritten_content: string;
  tts_formatted_content: string;
  analysis: ScriptAnalysisResult;
  word_count: {
    original: number;
    rewritten: number;
  };
  generated_at: Date;
}

// Legacy Script type for backward compatibility with scenes/export
export interface Script {
  content: string;
  word_count: number;
  generated_at: Date;
}

// Scene Breakdown - Psychoterra (Metaphorical Statue-Based Visuals)
export interface Scene {
  scene_number: number;
  script_snippet: string;
  visual_prompt: string; // Marble statue and abstract visual description
  historical_context?: string; // Repurposed as philosophical metaphor explanation
}

export interface StoryboardScene extends Scene {
  image_url?: string;
  generation_status: 'pending' | 'generating' | 'completed' | 'error';
  error_message?: string;
  is_regenerating?: boolean;
  image_pool_index?: number; // Index in the 60-image pool this scene is using
}

// Workflow Management
export type WorkflowStep = 1 | 2 | 3; // Upload → Enhance → Scenes

export type EnhancementStage =
  | 'idle'
  | 'analyzing'
  | 'rewriting'
  | 'formatting'
  | 'complete';

export interface SessionStore {
  // Current workflow step (1-3: Upload → Enhance → Scenes)
  currentStep: WorkflowStep;

  // Script enhancement state
  originalScript: string;
  enhancedScript: EnhancedScript | null;
  enhancementStage: EnhancementStage;

  // Generated content (for scenes/export)
  script: Script | null;
  scenes: Scene[];
  storyboardScenes: StoryboardScene[];

  // Workflow state
  isGenerating: boolean;
  errors: string[];
  sceneGenerationProgress: number;

  // Actions
  setOriginalScript: (script: string) => void;
  setEnhancedScript: (enhanced: EnhancedScript) => void;
  setEnhancementStage: (stage: EnhancementStage) => void;
  setScript: (script: Script) => void;
  setScenes: (scenes: Scene[]) => void;
  setStoryboardScenes: (scenes: StoryboardScene[]) => void;
  updateStoryboardScene: (sceneNumber: number, updates: Partial<StoryboardScene>) => void;
  setStep: (step: WorkflowStep) => void;
  setGenerating: (isGenerating: boolean) => void;
  setSceneGenerationProgress: (progress: number) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  reset: () => void;
}
