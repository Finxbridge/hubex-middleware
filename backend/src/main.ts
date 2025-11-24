import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Hubex API')
    .setDescription(
      `Visual API Integration & Workflow Builder API Documentation

## Overview
Hubex is a powerful platform for creating and managing API workflows visually.
This API allows you to:
- Authenticate users and manage their profiles
- Create and manage workflows with visual node-based configuration
- Configure authentication for external APIs (OAuth2, API Keys, Basic Auth)
- Execute workflows with custom inputs
- Track execution logs and monitor workflow performance

## Authentication
Most endpoints require JWT Bearer authentication.
1. Register a new user account at \`/auth/register\`
2. Login to get an access token at \`/auth/login\`
3. Include the token in the Authorization header: \`Bearer <token>\`

## Workflow Execution
- **Private execution**: Requires authentication via \`/execution/:workflowId\`
- **Public execution**: No authentication required via \`/execution/public/:slug\` (for published workflows)
      `
    )
    .setVersion('1.0')
    .setContact(
      'Hubex Team',
      'https://github.com/your-repo/hubex',
      'support@hubex.io'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('auth', 'Authentication and authorization endpoints')
    .addTag('users', 'User profile and management operations')
    .addTag('workflows', 'Create, read, update, and delete workflows')
    .addTag('auth-configs', 'Configure authentication for external APIs')
    .addTag('execution', 'Execute workflows with custom inputs')
    .addTag('logs', 'View execution logs and monitor performance')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name will be used to reference this security scheme
    )
    .addServer('http://localhost:3000', 'Local Development Server')
    .addServer('https://api.hubex.io', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        theme: 'monokai'
      },
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Hubex API Documentation',
    customfavIcon: 'https://hubex.io/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #1e1e1e; padding: 20px; border-radius: 4px }
    `,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`
    🚀 Hubex Backend is running!
    📡 API: http://localhost:${port}/${apiPrefix}
    📚 Swagger Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${configService.get<string>('NODE_ENV', 'development')}
  `);
}

bootstrap();
