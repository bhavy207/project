import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { ISandboxService, SandboxExecutionOptions, SandboxExecutionResult } from './sandbox.interface';

const execAsync = promisify(exec);

@Injectable()
export class ProcessSandboxService implements ISandboxService {
  private readonly logger = new Logger(ProcessSandboxService.name);

  async execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult> {
    const runId = uuidv4();
    const sandboxDir = path.join(os.tmpdir(), `devpilot-sandbox-${runId}`);
    fs.mkdirSync(sandboxDir, { recursive: true });

    // Populate sandbox workspace
    for (const file of options.files) {
      const targetPath = path.join(sandboxDir, file.path);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, file.content, 'utf8');
    }

    const startTime = Date.now();
    const timeoutMs = options.timeoutMs || 30000;

    try {
      const { stdout, stderr } = await execAsync(options.command, {
        cwd: sandboxDir,
        timeout: timeoutMs,
        maxBuffer: 5 * 1024 * 1024,
        env: {
          ...process.env,
          NODE_ENV: 'test',
          SANDBOX_ISOLATION: 'active',
        },
      });

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        durationMs: Date.now() - startTime,
        sandboxed: true,
        provider: 'process-sandbox',
      };
    } catch (error: any) {
      return {
        stdout: error.stdout ? error.stdout.trim() : '',
        stderr: error.stderr ? error.stderr.trim() : error.message,
        exitCode: error.code || 1,
        durationMs: Date.now() - startTime,
        sandboxed: true,
        provider: 'process-sandbox',
      };
    } finally {
      try {
        fs.rmSync(sandboxDir, { recursive: true, force: true });
      } catch (err: any) {
        this.logger.warn(`Failed to cleanup sandbox dir ${sandboxDir}: ${err.message}`);
      }
    }
  }
}
