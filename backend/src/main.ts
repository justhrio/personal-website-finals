import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function loadLocalEnv(): void {
  const proc = process as NodeJS.Process & {
    loadEnvFile?: (path?: string) => void;
  };
  if (typeof proc.loadEnvFile === 'function') {
    try {
      proc.loadEnvFile();
    } catch {
      // No local .env file present; rely on process environment variables.
    }
  }
}

async function bootstrap() {
  loadLocalEnv();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
