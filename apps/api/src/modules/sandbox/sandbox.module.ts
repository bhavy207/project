import { Module } from '@nestjs/common';
import { DockerSandboxService } from './docker-sandbox.service';
import { ProcessSandboxService } from './process-sandbox.service';
import { SandboxManagerService } from './sandbox-manager.service';

@Module({
  providers: [DockerSandboxService, ProcessSandboxService, SandboxManagerService],
  exports: [SandboxManagerService],
})
export class SandboxModule {}
