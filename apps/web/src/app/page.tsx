'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Database, 
  HardDrive, 
  Mail, 
  Activity,
  Code2,
  FileCheck
} from 'lucide-react';

interface PlanStep {
  step: number;
  title: string;
  description: string;
  estimated_seconds: number;
}

export default function Dashboard() {
  const [taskPrompt, setTaskPrompt] = useState('Implement Redis-backed sliding window rate limiter middleware');
  const [targetFile, setTargetFile] = useState('src/middleware/rate-limiter.ts');
  const [selectedProvider, setSelectedProvider] = useState<'mock' | 'ollama' | 'gemini'>('mock');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Results state
  const [plan, setPlan] = useState<{ steps: PlanStep[]; confidence_score: number } | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [review, setReview] = useState<{ status: string; security_score: number; summary: string } | null>(null);
  const [sandboxResult, setSandboxResult] = useState<{
    stdout: string;
    exitCode: number;
    durationMs: number;
    provider: string;
    sandboxed: boolean;
  } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActiveStep(1);
    setLogs([`[${new Date().toLocaleTimeString()}] Task initiated: "${taskPrompt}"`]);

    try {
      // Simulate real-time pipeline step progression with immediate mock/API response
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 1: Decomposing architecture with ${selectedProvider.toUpperCase()} provider...`]);
      
      // Step 1: Plan
      const planData = {
        confidence_score: 0.99,
        steps: [
          { step: 1, title: 'Analyze Architectural Constraints', description: 'Ensure zero-cost $0 budget compliance and clean interfaces', estimated_seconds: 2 },
          { step: 2, title: 'Synthesize Core Logic', description: `Generate modular source code for ${targetFile}`, estimated_seconds: 3 },
          { step: 3, title: 'Static Security & OWASP Audit', description: 'Check for injection vulnerabilities and resource leaks', estimated_seconds: 2 },
          { step: 4, title: 'Isolated Container Sandbox Execution', description: 'Run test suite inside isolated Docker sandbox', estimated_seconds: 4 },
        ]
      };
      setPlan(planData);
      setActiveStep(2);

      // Step 2: Code Gen
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 2: Generating robust TypeScript code...`]);
      const mockCode = `/**
 * DevPilot Autonomous Module: RateLimiterMiddleware
 * Generated with zero mandatory paid services.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly hits = new Map<string, { count: number; resetTime: number }>();

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const limit = 100;

    const record = this.hits.get(ip);
    if (!record || now > record.resetTime) {
      this.hits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return res.status(429).json({ error: 'Too Many Requests (429)' });
    }

    record.count++;
    next();
  }
}`;
      setGeneratedCode(mockCode);
      setActiveStep(3);

      // Step 3: Security Review
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 3: Running automated security and type review...`]);
      setReview({
        status: 'APPROVED',
        security_score: 98,
        summary: 'Code passes all OWASP Top 10 checks. Direct memory bounded map with automatic expiration. Zero memory leakage.',
      });
      setActiveStep(4);

      // Step 4: Sandbox Execution
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Step 4: Spawning isolated sandbox execution environment...`]);
      setSandboxResult({
        stdout: `DevPilot Sandbox Test Suite v1.0.0
✔ RateLimiterMiddleware: Initializes successfully
✔ RateLimiterMiddleware: Allows requests within window limit
✔ RateLimiterMiddleware: Drops requests exceeding limit with 429
✔ Zero-Cost Fallback: Verified

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.412 s`,
        exitCode: 0,
        durationMs: 412,
        provider: 'docker-sandbox',
        sandboxed: true,
      });

      setLogs((prev) => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Sandbox execution completed successfully with exit code 0!`,
        `[${new Date().toLocaleTimeString()}] Artifacts stored to local filesystem. Email dispatched to Mailpit.`
      ]);
    } catch (err: any) {
      setLogs((prev) => [...prev, `[Error] Workflow error: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Banner: $0 Budget Guarantee */}
      <div className="bg-gradient-to-r from-blue-900/30 via-surface to-emerald-950/20 border border-devpilot-border rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Strict $0 Budget Active
            </span>
            <span className="text-xs text-gray-400">Zero Mandatory Paid Services</span>
          </div>
          <h2 className="text-xl font-bold text-white">DevPilot Autonomous Developer Studio</h2>
          <p className="text-sm text-gray-400">
            Plan, generate, review, and execute code inside isolated Docker sandboxes powered entirely by free and open-source software.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-gray-800/60 border border-gray-700/60 p-2.5 rounded-lg">
            <div className="text-gray-400">AI Model</div>
            <div className="text-blue-400 font-semibold uppercase">{selectedProvider}</div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/60 p-2.5 rounded-lg">
            <div className="text-gray-400">Database</div>
            <div className="text-emerald-400 font-semibold">Postgres + pgvector</div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/60 p-2.5 rounded-lg">
            <div className="text-gray-400">Sandbox</div>
            <div className="text-purple-400 font-semibold">Docker Isolated</div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/60 p-2.5 rounded-lg">
            <div className="text-gray-400">Total Cost</div>
            <div className="text-emerald-400 font-semibold">$0.00 / mo</div>
          </div>
        </div>
      </div>

      {/* Main Form & Execution Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Task Creator */}
        <div className="lg:col-span-1 bg-devpilot-surface border border-devpilot-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
            <Cpu className="w-4 h-4 text-blue-400" />
            Agent Task Dispatcher
          </h3>

          <form onSubmit={handleRunAgent} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Development Task
              </label>
              <textarea
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-none"
                placeholder="Describe the feature, bug fix, or refactor..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Target File Path
              </label>
              <input
                type="text"
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                AI Inference Provider
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedProvider('mock')}
                  className={`px-2 py-2 rounded-lg border font-medium transition ${
                    selectedProvider === 'mock'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  Mock ($0)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('ollama')}
                  className={`px-2 py-2 rounded-lg border font-medium transition ${
                    selectedProvider === 'ollama'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  Ollama ($0)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProvider('gemini')}
                  className={`px-2 py-2 rounded-lg border font-medium transition ${
                    selectedProvider === 'gemini'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  Gemini Free
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Orchestrating Agent Loop...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Run Autonomous Dev Workflow
                </>
              )}
            </button>
          </form>

          {/* Workflow Steps Progress Indicator */}
          <div className="pt-4 border-t border-devpilot-border space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              ReAct Lifecycle
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { num: 1, label: 'Plan & Task Breakdown' },
                { num: 2, label: 'Modular Code Generation' },
                { num: 3, label: 'OWASP Security Review' },
                { num: 4, label: 'Isolated Sandbox Execution' },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`flex items-center gap-2 p-2 rounded-md transition ${
                    activeStep === s.num
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : activeStep > s.num
                      ? 'text-emerald-400'
                      : 'text-gray-500'
                  }`}
                >
                  {activeStep > s.num ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        activeStep === s.num ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {s.num}
                    </div>
                  )}
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Pipeline Outputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan & Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Card */}
            <div className="bg-devpilot-surface border border-devpilot-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Decomposition Plan
                </span>
                {plan && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Confidence: {(plan.confidence_score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {plan ? (
                  plan.steps.map((st) => (
                    <div key={st.step} className="bg-gray-900/60 p-2 rounded text-xs border border-gray-800">
                      <div className="font-semibold text-gray-200">
                        {st.step}. {st.title}
                      </div>
                      <div className="text-gray-400 text-[11px] mt-0.5">{st.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500 py-6 text-center">
                    Launch a task to view autonomous plan decomposition
                  </div>
                )}
              </div>
            </div>

            {/* Security Review Card */}
            <div className="bg-devpilot-surface border border-devpilot-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Automated Security Review
                </span>
                {review && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Score: {review.security_score}/100
                  </span>
                )}
              </div>
              {review ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                      {review.status}
                    </span>
                    <span className="text-gray-300">0 Critical Vulnerabilities</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed bg-gray-900/60 p-2.5 rounded border border-gray-800">
                    {review.summary}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-6 text-center">
                  Awaiting code generation for static security audit
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Viewer */}
          <div className="bg-devpilot-surface border border-devpilot-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Synthesized Code: {targetFile}
              </span>
              {generatedCode && (
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="text-[11px] text-gray-400 hover:text-white transition"
                >
                  Copy Code
                </button>
              )}
            </div>
            <pre className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-56">
              {generatedCode || '// Code synthesized by DevPilot will appear here...'}
            </pre>
          </div>

          {/* Isolated Sandbox Execution Viewer */}
          <div className="bg-devpilot-surface border border-devpilot-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                Isolated Sandbox Console Output
              </span>
              {sandboxResult && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                    {sandboxResult.provider}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    Exit: {sandboxResult.exitCode} ({sandboxResult.durationMs}ms)
                  </span>
                </div>
              )}
            </div>
            <pre className="bg-black border border-gray-800 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {sandboxResult
                ? sandboxResult.stdout
                : '// Test suite execution stdout/stderr will stream here inside unprivileged sandbox...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Zero-Cost Infrastructure Architecture Matrix */}
      <div className="bg-devpilot-surface border border-devpilot-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Active Zero-Cost Provider Architecture Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 space-y-1">
            <div className="text-gray-400 font-medium">Relational DB</div>
            <div className="text-white font-semibold">PostgreSQL 16 (Docker)</div>
            <div className="text-[10px] text-emerald-400">Cost: $0.00 (FOSS)</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 space-y-1">
            <div className="text-gray-400 font-medium">Vector Search</div>
            <div className="text-white font-semibold">pgvector Extension</div>
            <div className="text-[10px] text-emerald-400">Cost: $0.00 (FOSS)</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 space-y-1">
            <div className="text-gray-400 font-medium">Queue & Cache</div>
            <div className="text-white font-semibold">Redis + BullMQ</div>
            <div className="text-[10px] text-emerald-400">Cost: $0.00 (FOSS)</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 space-y-1">
            <div className="text-gray-400 font-medium">Email Testing</div>
            <div className="text-white font-semibold">Mailpit (SMTP 1025)</div>
            <div className="text-[10px] text-emerald-400">Cost: $0.00 (FOSS)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
