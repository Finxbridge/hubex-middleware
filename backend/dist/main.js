"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const apiPrefix = configService.get('API_PREFIX', 'api');
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Hubex API')
        .setDescription(`Visual API Integration & Workflow Builder API Documentation

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
      `)
        .setVersion('1.0')
        .setContact('Hubex Team', 'https://github.com/your-repo/hubex', 'support@hubex.io')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addTag('auth', 'Authentication and authorization endpoints')
        .addTag('users', 'User profile and management operations')
        .addTag('workflows', 'Create, read, update, and delete workflows')
        .addTag('auth-configs', 'Configure authentication for external APIs')
        .addTag('execution', 'Execute workflows with custom inputs')
        .addTag('logs', 'View execution logs and monitor performance')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .addServer('http://localhost:3000', 'Local Development Server')
        .addServer('https://api.hubex.io', 'Production Server')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`
    🚀 Hubex Backend is running!
    📡 API: http://localhost:${port}/${apiPrefix}
    📚 Swagger Docs: http://localhost:${port}/api/docs
    🌍 Environment: ${configService.get('NODE_ENV', 'development')}
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map