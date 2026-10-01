import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SandboxModule } from './modules/sandbox/sandbox.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    MetricsModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    SandboxModule,
  ],
})
export class AppModule {}
