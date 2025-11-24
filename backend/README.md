# Hubex Backend

Visual API Integration & Workflow Builder - Backend API

## Overview

Hubex backend is a NestJS-based REST API that powers the visual workflow builder platform. It provides endpoints for creating, managing, and executing API workflows with support for authentication, logging, and external API integrations.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Workflow Management**: Create, update, delete, and publish workflows
- **Workflow Execution**: Execute workflows with custom inputs
- **External API Auth**: Support for API Keys, OAuth2, and Basic Auth
- **Execution Logging**: Track and monitor workflow executions
- **Interactive API Docs**: Swagger UI for testing and documentation

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport JWT
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI 3.0
- **HTTP Client**: Axios

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file with the following:

```env
# Server
PORT=3000
NODE_ENV=development

# API
API_PREFIX=api

# CORS
CORS_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=hubex
DB_PASSWORD=password
DB_NAME=hubex

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=your-encryption-key
```

### Running the Application

```bash
# Development with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000/api`

## API Documentation

### Swagger UI (Interactive)

Once the server is running, access the interactive API documentation:

**URL**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

The Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Authentication setup
- Schema visualization
- Try-it-out functionality

For detailed Swagger UI usage, see [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)

### API Reference

For complete API documentation including:
- Endpoint descriptions
- Authentication guide
- Common use cases
- Error handling
- Rate limiting

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Implementation Details

For information about the Swagger implementation:

See [SWAGGER_IMPLEMENTATION_SUMMARY.md](./SWAGGER_IMPLEMENTATION_SUMMARY.md)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Users
- `GET /users` - List all users
- `GET /users/me` - Get current user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Workflows
- `POST /workflows` - Create workflow
- `GET /workflows` - List workflows
- `GET /workflows/:id` - Get workflow
- `PATCH /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow
- `POST /workflows/:id/publish` - Publish workflow
- `POST /workflows/:id/unpublish` - Unpublish workflow

### Auth Configs
- `POST /auth-configs` - Create auth config
- `GET /auth-configs` - List auth configs
- `GET /auth-configs/:id` - Get auth config
- `PATCH /auth-configs/:id` - Update auth config
- `DELETE /auth-configs/:id` - Delete auth config

### Execution
- `POST /execution/:workflowId` - Execute workflow (auth required)
- `POST /execution/public/:slug` - Execute public workflow

### Logs
- `GET /logs/workflow/:workflowId` - Get workflow logs
- `GET /logs/:id` - Get log by ID
- `GET /logs/status/:status` - Filter logs by status

## Development

### Project Structure

```
src/
├── auth/               # Authentication module
│   ├── dto/           # DTOs and response models
│   ├── guards/        # JWT auth guards
│   └── strategies/    # Passport strategies
├── users/             # User management
├── workflows/         # Workflow CRUD
├── auth-configs/      # External API auth
├── execution/         # Workflow execution engine
│   └── processors/    # Node processors
├── logs/              # Execution logging
├── common/            # Shared services
│   └── services/      # Encryption, HTTP client
└── main.ts           # Application entry point
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type checking
npm run build
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

**For complete database setup, migrations, and troubleshooting guide, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)**

## Docker

### Build Docker Image

```bash
docker build -t hubex-backend .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## Security

- **JWT Authentication**: All sensitive endpoints require JWT tokens
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: class-validator for all inputs
- **SQL Injection**: Protected by TypeORM parameterized queries
- **Encryption**: Sensitive data encrypted at rest
- **CORS**: Configurable origin restrictions

## Best Practices

1. **Always use DTOs**: Define request/response structures
2. **Validate inputs**: Use class-validator decorators
3. **Handle errors**: Use NestJS exception filters
4. **Log properly**: Use NestJS logger
5. **Test thoroughly**: Write unit and E2E tests
6. **Document APIs**: Add Swagger decorators

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change PORT in .env or kill the process
lsof -ti:3000 | xargs kill -9
```

**Database connection failed**
```bash
# Check PostgreSQL is running
# Verify credentials in .env
# Ensure database exists
```

**JWT token expired**
```bash
# Token expiry is set in JWT_EXPIRES_IN
# Users need to login again
```

### Debug Mode

Run in debug mode to see detailed logs:

```bash
npm run start:debug
```

Then attach your debugger to port 9229.

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Update documentation
5. Submit a pull request

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run start:dev` | Start dev server with watch |
| `npm run start:debug` | Start with debugger |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:cov` | Generate coverage report |

## License

MIT

## Support

- **Documentation**: See docs in this folder
- **Issues**: Create GitHub issue
- **Email**: support@hubex.io
