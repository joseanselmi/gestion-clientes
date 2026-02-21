import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  // CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  'http://localhost:3000',
].filter(Boolean);

app.enableCors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

  // Filtro global de errores
  app.useGlobalFilters(new AllExceptionsFilter());

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestión de Clientes API')
    .setDescription('API REST para Eglow Studio - Gestión de Clientes')
    .setVersion('1.0')
    .addTag('clientes', 'Operaciones sobre clientes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT) || 4000;
await app.listen(port, '0.0.0.0');
  console.log(`\n🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📚 Swagger docs en http://localhost:${port}/api/docs\n`);
}

bootstrap();

