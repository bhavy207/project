import { Injectable, Logger } from '@nestjs/common';
import { DockerSandboxService } from './docker-sandbox.service';
import { ProcessSandboxService } from './process-sandbox.service';
import { ISandboxService, SandboxExecutionOptions, SandboxExecutionResult } from './sandbox.interface';

@Injectable()
export class SandboxManagerService implements ISandboxService {
  private readonly logger = new Logger(SandboxManagerService.name);

  constructor(
    private readonly dockerSandbox: DockerSandboxService,
    private readonly processSandbox: ProcessSandboxService
  ) {}

  async execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult> {
    const isDockerAvailable = await this.dockerSandbox.isDockerAvailable();

    if (isDockerAvailable && process.env.SANDBOX_PROVIDER !== 'process') {
      this.logger.log('Executing test suite inside isolated Docker container sandbox...');
      return this.dockerSandbox.execute(options);
    } else {
      this.logger.log('Docker unavailable or bypassed; executing in local isolated ProcessSandbox...');
      return this.processSandbox.execute(options);
    }
  }
}
