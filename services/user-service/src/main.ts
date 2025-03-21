import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ErrorHandlerFilter } from './common/filters/error-handler.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new ErrorHandlerFilter());

  const port = process.env.PORT ?? 9700;
  await app.listen(port);
  console.log(`🚀 User Service is running on: http://localhost:${port}/api/v1`);
}

bootstrap();
