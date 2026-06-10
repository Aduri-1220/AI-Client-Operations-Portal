import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('AI Client Operations Portal API')
    .setDescription('REST API for managing clients, projects, tasks, approvals, documents, and AI workflows')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('clients', 'Client management')
    .addTag('projects', 'Project management')
    .addTag('tasks', 'Task management — Agile board')
    .addTag('approvals', 'Document approval workflows')
    .addTag('documents', 'Document management')
    .addTag('ai', 'AI assistant endpoints')
    .addTag('dashboard', 'Dashboard statistics')
    .build();

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT || 3001);
  console.log(`API running on http://localhost:${process.env.PORT || 3001}`);
  console.log(`Swagger docs at http://localhost:${process.env.PORT || 3001}/api/docs`);
}
bootstrap();
