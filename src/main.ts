import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { envSchema } from './config/env.schema.js';

const env = envSchema.parse(process.env);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(env.PORT);
}
bootstrap();
