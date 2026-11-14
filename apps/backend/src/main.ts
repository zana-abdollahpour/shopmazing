import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { StandardSchemaValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.use(cookieParser());

  await app.listen(app.get(ConfigService).getOrThrow('PORT') ?? 3001);
}
await bootstrap();
