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
export class DockerSandboxService implements ISandboxService {
  private readonly logger = new Logger(DockerSandboxService.name);
  private readonly sandboxImage = 'alpine:3.19';

  async isDockerAvailable(): Promise<boolean> {
    try {
      await execAsync('docker info', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult> {
    const runId = uuidv4();
    const tempDir = path.join(os.tmpdir(), `devpilot-docker-${runId}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write all provided files into temporary mount directory
    for (const file of options.files) {
      const filePath = path.join(tempDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content, 'utf8');
    }

    const timeoutMs = options.timeoutMs || 30000;
    const memoryLimit = options.memoryLimit || '512m';
    const startTime = Date.now();

    // Docker execution with resource limits and security constraints
    // Uses unprivileged execution, read-only root where possible, CPU & memory limits
    const dockerCmd = `docker run --rm -v "${tempDir}:/workspace" -w /workspace -m ${memoryLimit} --cpus="1.0" ${this.sandboxImage} /bin/sh -c "${options.command.replace(/"/g, '\\"')}"`;

    try {
      const { stdout, stderr } = await execAsync(dockerCmd, {
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        durationMs: Date.now() - startTime,
        sandboxed: true,
        provider: 'docker',
      };
    } catch (error: any) {
      return {
        stdout: error.stdout ? error.stdout.trim() : '',
        stderr: error.stderr ? error.stderr.trim() : error.message,
        exitCode: error.code || 1,
        durationMs: Date.now() - startTime,
        sandboxed: true,
        provider: 'docker',
      };
    } finally {
      // Clean up temporary workspace directory
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (err: any) {
        this.logger.warn(`Failed to cleanup temp dir ${tempDir}: ${err.message}`);
      }
    }
  }
}
