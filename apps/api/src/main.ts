import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createRouteHandler } from 'uploadthing/express';
import { AppModule } from './app.module';
import { uploadRouter } from './uploadthing/upload-router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    '/api/uploadthing',
    createRouteHandler({
      router: uploadRouter,
      config: { token: process.env.UPLOADTHING_TOKEN! },
    }),
  );
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
