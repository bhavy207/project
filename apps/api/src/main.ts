import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('DevPilotBootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  logger.log(`=======================================================`);
  logger.log(`🚀 DevPilot NestJS API running on: http://localhost:${port}`);
  logger.log(`📊 Prometheus Metrics available at: http://localhost:${port}/metrics`);
  logger.log(`🔒 Authentication: Direct self-hosted JWT ($0 budget)`);
  logger.log(`📦 Active Storage Provider: ${process.env.STORAGE_PROVIDER || 'local'}`);
  logger.log(`✉️  Active Email Provider: ${process.env.EMAIL_PROVIDER || 'mailpit'}`);
  logger.log(`=======================================================`);
}

bootstrap();
