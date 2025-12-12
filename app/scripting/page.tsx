"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Check, Loader2, FileText, Brain, Lightbulb, Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ScriptAnalysisResult, EnhancedScript } from '@/lib/types';
import { useSessionStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { countWords } from '@/lib/utils/word-count';

type EnhancementStage = 'idle' | 'analyzing' | 'rewriting' | 'formatting' | 'complete';

export default function ScriptEnhancementPage() {
  const router = useRouter();
  const { setOriginalScript, setEnhancedScript, setEnhancementStage, setScript } = useSessionStore();

  const [scriptInput, setScriptInput] = useState('');
  const [stage, setStage] = useState<EnhancementStage>('idle');

  const [analysisResult, setAnalysisResult] = useState<ScriptAnalysisResult | null>(null);
  const [rewrittenScript, setRewrittenScript] = useState<string>('');
  const [ttsFormattedScript, setTtsFormattedScript] = useState<string>('');

  const [copied, setCopied] = useState<'rewritten' | 'tts' | null>(null);

  const handleEnhance = async () => {
    if (!scriptInput.trim()) {
      toast.error('Please paste or type your script');
      return;
    }

    if (scriptInput.length < 50) {
      toast.error('Script is too short (minimum 50 characters)');
      return;
    }

    try {
      // ============================================================================
      // STAGE 1: Analyze Script Quality
      // ============================================================================
      setStage('analyzing');
      setEnhancementStage('analyzing');
      toast.loading('Analyzing script quality and finding philosophers...', { id: 'enhance' });

      const analyzeResponse = await fetch('/api/analyze/script-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptInput }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Script analysis failed');
      }

      const analysis: ScriptAnalysisResult = await analyzeResponse.json();
      setAnalysisResult(analysis);

      console.log('[Stage 1] Script analysis completed:', analysis);

      // ============================================================================
      // STAGE 2: Rewrite Script
      // ============================================================================
      setStage('rewriting');
      setEnhancementStage('rewriting');
      toast.loading('Rewriting script with improvements...', { id: 'enhance' });

      const rewriteResponse = await fetch('/api/enhance/rewrite-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptInput, analysis }),
      });

      if (!rewriteResponse.ok) {
        const errorData = await rewriteResponse.json();
        throw new Error(errorData.error || 'Script rewriting failed');
      }

      const rewriteData = await rewriteResponse.json();
      const rewritten = rewriteData.rewritten_script;
      setRewrittenScript(rewritten);

      console.log('[Stage 2] Script rewriting completed');

      // ============================================================================
      // STAGE 3: Format for TTS (OpenAI)
      // ============================================================================
      setStage('formatting');
      setEnhancementStage('formatting');
      toast.loading('Formatting for voiceover (OpenAI)...', { id: 'enhance' });

      const ttsResponse = await fetch('/api/format/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: rewritten }),
      });

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        throw new Error(errorText || 'TTS formatting failed');
      }

      // Read streaming response as text with real-time UI updates
      const reader = ttsResponse.body?.getReader();
      const decoder = new TextDecoder();
      let formatted = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          formatted += chunk;
          setTtsFormattedScript(formatted); // Update UI as chunks arrive
        }
      }

      console.log('[Stage 3] TTS formatting completed');

      // ============================================================================
      // Save to Store
      // ============================================================================
      const enhanced: EnhancedScript = {
        original_content: scriptInput,
        rewritten_content: rewritten,
        tts_formatted_content: formatted,
        analysis: analysis,
        word_count: {
          original: countWords(scriptInput),
          rewritten: countWords(rewritten),
        },
        generated_at: new Date(),
      };

      setOriginalScript(scriptInput);
      setEnhancedScript(enhanced);
      setEnhancementStage('complete');

      // Also set the script for scenes/export functionality
      setScript({
        content: formatted,
        word_count: countWords(formatted),
        generated_at: new Date(),
      });

      setStage('complete');
      toast.success('Script enhancement complete!', { id: 'enhance' });
    } catch (error) {
      console.error('Enhancement error:', error);
      setStage('idle');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Enhancement failed: ${errorMessage}`, { id: 'enhance' });
    }
  };

  const handleCopy = async (type: 'rewritten' | 'tts') => {
    const text = type === 'rewritten' ? rewrittenScript : ttsFormattedScript;
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success(`${type === 'rewritten' ? 'Rewritten' : 'TTS-formatted'} script copied!`);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleProceedToScenes = () => {
    if (ttsFormattedScript) {
      router.push('/scenes');
    }
  };

  const handleStartOver = () => {
    setStage('idle');
    setScriptInput('');
    setAnalysisResult(null);
    setRewrittenScript('');
    setTtsFormattedScript('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Input Card */}
        {stage === 'idle' && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-serif">Script Enhancement Pipeline</CardTitle>
              <CardDescription className="text-base">
                Upload your script to analyze quality, find relevant ancient philosophers, rewrite for
                improvement, and format for voiceover delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="script" className="text-base font-medium">
                  Your Script
                </Label>
                <Textarea
                  id="script"
                  value={scriptInput}
                  onChange={(e) => setScriptInput(e.target.value)}
                  placeholder="Paste your script here..."
                  className="min-h-[300px] text-base font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  {countWords(scriptInput)} words · Minimum 50 characters required
                </p>
              </div>

              <Button
                onClick={handleEnhance}
                className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90"
                size="lg"
                disabled={scriptInput.length < 50}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Enhance Script
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enhancement Progress & Results */}
        {stage !== 'idle' && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Enhancement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${stage === 'analyzing' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stage === 'analyzing' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
                    <span className="font-medium">Analyzing</span>
                    {(stage === 'rewriting' || stage === 'formatting' || stage === 'complete') && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className={`flex items-center gap-2 ${stage === 'rewriting' || stage === 'formatting' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stage === 'rewriting' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lightbulb className="h-5 w-5" />}
                    <span className="font-medium">Rewriting</span>
                    {(stage === 'formatting' || stage === 'complete') && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className={`flex items-center gap-2 ${stage === 'formatting' || stage === 'complete' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stage === 'formatting' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
                    <span className="font-medium">TTS Formatting</span>
                    {stage === 'complete' && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="shadow-lg border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-serif flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Script Quality Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scores */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`border rounded-lg p-4 ${getScoreBgColor(analysisResult.scores.accuracy)}`}>
                      <div className="text-sm font-medium text-muted-foreground">Accuracy</div>
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResult.scores.accuracy)}`}>
                        {analysisResult.scores.accuracy}
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 ${getScoreBgColor(analysisResult.scores.hook_strength)}`}>
                      <div className="text-sm font-medium text-muted-foreground">Hook Strength</div>
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResult.scores.hook_strength)}`}>
                        {analysisResult.scores.hook_strength}
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 ${getScoreBgColor(analysisResult.scores.retention_tactics)}`}>
                      <div className="text-sm font-medium text-muted-foreground">Retention</div>
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResult.scores.retention_tactics)}`}>
                        {analysisResult.scores.retention_tactics}
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 ${getScoreBgColor(analysisResult.scores.overall)}`}>
                      <div className="text-sm font-medium text-muted-foreground">Overall</div>
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResult.scores.overall)}`}>
                        {analysisResult.scores.overall}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Detailed Feedback</h4>
                    <div className="space-y-2 text-sm">
                      <div className="bg-muted/30 p-3 rounded">
                        <span className="font-medium">Accuracy:</span> {analysisResult.detailed_feedback.accuracy_notes}
                      </div>
                      <div className="bg-muted/30 p-3 rounded">
                        <span className="font-medium">Hook:</span> {analysisResult.detailed_feedback.hook_notes}
                      </div>
                      <div className="bg-muted/30 p-3 rounded">
                        <span className="font-medium">Retention:</span> {analysisResult.detailed_feedback.retention_notes}
                      </div>
                    </div>
                  </div>

                  {/* Philosopher Matches */}
                  {analysisResult.philosopher_matches.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Ancient Philosopher Insights</h4>
                      <div className="space-y-3">
                        {analysisResult.philosopher_matches.map((phil, idx) => (
                          <div key={idx} className="border border-border/50 rounded-lg p-4 bg-card">
                            <div className="font-semibold text-base">{phil.name}</div>
                            <div className="text-xs text-muted-foreground mb-2">{phil.era}</div>
                            <div className="text-sm mb-2">{phil.teaching}</div>
                            <div className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium">Relevance:</span> {phil.relevance_explanation}
                            </div>
                            {phil.quote && (
                              <div className="text-sm italic border-l-2 border-primary pl-3 mt-2">
                                &ldquo;{phil.quote}&rdquo;
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Rewritten Script */}
            {rewrittenScript && (
              <Card className="shadow-lg border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Enhanced Script
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => handleCopy('rewritten')}>
                      {copied === 'rewritten' ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-card border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {rewrittenScript}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TTS Formatted Script */}
            {ttsFormattedScript && (
              <Card className="shadow-lg border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Mic className="h-5 w-5" />
                      TTS-Formatted Script
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy('tts')}>
                        {copied === 'tts' ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button onClick={handleProceedToScenes} className="bg-primary">
                        <FileText className="mr-2 h-4 w-4" />
                        Proceed to Scenes →
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-card border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {ttsFormattedScript}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {stage === 'complete' && (
              <div className="flex justify-center">
                <Button onClick={handleStartOver} variant="outline" size="lg">
                  Enhance Another Script
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
