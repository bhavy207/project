export interface SandboxFile {
  path: string;
  content: string;
}

export interface SandboxExecutionOptions {
  files: SandboxFile[];
  command: string;
  timeoutMs?: number;
  memoryLimit?: string;
}

export interface SandboxExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  sandboxed: boolean;
  provider: 'docker' | 'process-sandbox';
}

export interface ISandboxService {
  execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult>;
}
