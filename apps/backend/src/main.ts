// Register tsconfig-paths to resolve path aliases at runtime
import 'tsconfig-paths/register';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('KOMPASS API')
    .setDescription('KOMPASS CRM and Project Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`🚀 KOMPASS Backend API is running on: http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start application:', error);
  process.exit(1);
});
