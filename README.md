# Hubex - Visual API Integration & Workflow Builder

> Make connecting, managing, and sharing APIs as simple as dragging blocks together.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

Hubex is a no-code API orchestration platform that lets users visually integrate and manage any external API through an intuitive drag-and-drop interface. Build complex API workflows without writing code - just connect nodes and configure parameters.

## Features

### Core Features
- **Visual Workflow Builder**: Drag-and-drop interface for API integration using React Flow
- **Multi-Auth Support**: API Key, OAuth2, JWT, Basic Auth, Bearer Token
- **Workflow Execution**: Chain multiple APIs together with conditional logic
- **Reusable Endpoints**: Export workflows as callable REST endpoints
- **Real-time Testing**: Test APIs instantly with JSON response viewer
- **Secure by Default**: AES-256 encryption for credentials

### Security
- AES-256 encryption for all credentials
- JWT-based authentication with refresh tokens
- HTTPS/TLS for all communications
- Audit logging for all executions
- Role-based access control (RBAC)
- Rate limiting and request throttling

## Tech Stack

### Backend
- **Framework**: NestJS 10.3
- **Runtime**: Node.js >= 18
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM 0.3
- **Authentication**: Passport.js + JWT
- **API Client**: Axios
- **Encryption**: Node.js crypto (AES-256)
- **Caching**: Redis (optional)
- **API Docs**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **Canvas**: React Flow 11
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3
- **State Management**: Zustand 4
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: TypeORM
- **Testing**: Jest (Backend), Vitest (Frontend)
- **Code Quality**: ESLint, Prettier

## Project Structure

```
hubex/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT, Passport)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── dto/           # Login, Register DTOs
│   │   ├── users/             # User management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── user.entity.ts
│   │   │   └── dto/           # User DTOs
│   │   ├── workflows/         # Workflow CRUD operations
│   │   │   ├── workflows.controller.ts
│   │   │   ├── workflows.service.ts
│   │   │   ├── workflow.entity.ts
│   │   │   └── dto/           # Workflow DTOs
│   │   ├── execution/         # Workflow execution engine
│   │   │   ├── execution.controller.ts
│   │   │   ├── execution.service.ts
│   │   │   └── execution.entity.ts
│   │   ├── auth-configs/      # Auth configuration management
│   │   │   ├── auth-configs.controller.ts
│   │   │   ├── auth-configs.service.ts
│   │   │   └── auth-config.entity.ts
│   │   ├── logs/              # Execution logs
│   │   │   ├── logs.controller.ts
│   │   │   ├── logs.service.ts
│   │   │   └── log.entity.ts
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/    # Custom decorators
│   │   │   ├── filters/       # Exception filters
│   │   │   ├── guards/        # Auth guards
│   │   │   ├── interceptors/  # Request/response interceptors
│   │   │   └── pipes/         # Validation pipes
│   │   ├── database/          # Database configuration
│   │   │   ├── database.module.ts
│   │   │   └── data-source.ts
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── test/                  # E2E tests
│   ├── migrations/            # Database migrations
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── layout/       # Layout components
│   │   │   └── shared/       # Shared components
│   │   ├── pages/            # Page components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── WorkflowBuilderPage.tsx
│   │   ├── store/            # Zustand state management
│   │   │   ├── authStore.ts
│   │   │   ├── workflowStore.ts
│   │   │   └── canvasStore.ts
│   │   ├── services/         # API service layer
│   │   │   ├── api.ts        # Axios instance
│   │   │   ├── authService.ts
│   │   │   └── workflowService.ts
│   │   ├── types/            # TypeScript type definitions
│   │   │   ├── auth.ts
│   │   │   ├── workflow.ts
│   │   │   └── api.ts
│   │   ├── utils/            # Helper functions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Application entry point
│   ├── public/               # Static assets
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── docker-compose.yml         # Docker orchestration
├── .gitignore
└── README.md                  # This file
```

## Quick Start

### Option 1: Docker Setup (Recommended)

The fastest way to get started:

```bash
# Clone the repository
git clone https://github.com/yourusername/hubex.git
cd hubex

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000/api
# Swagger Docs: http://localhost:3000/api/docs
```

This will start:
- Redis (port 6379)
- Backend API (port 3000)
- Frontend (port 5173)

### Option 2: Manual Setup

See [Installation](#installation) section below for detailed manual setup.

## Installation

### Prerequisites

- **Node.js**: >= 18.0.0
- **PostgreSQL**: >= 14.0
- **Redis**: >= 7.0 (optional, for caching)
- **Docker**: >= 20.10 (optional)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

4. **Start PostgreSQL**:

Using Docker:
```bash
docker run --name hubex-postgres \
  -e POSTGRES_DB=hubex \
  -e POSTGRES_USER=hubex \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

Or use your local PostgreSQL installation.

5. **Run database migrations**:
```bash
npm run migration:run
```

6. **Start development server**:
```bash
npm run start:dev
```

Backend will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Hubex
VITE_APP_VERSION=1.0.0
```

4. **Start development server**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Configuration

### Backend Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=hubex
DATABASE_PASSWORD=hubex_dev_password
DATABASE_NAME=hubex
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true
DATABASE_SSL=false

# Redis (optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRATION=7d

# Encryption (32+ characters for AES-256)
ENCRYPTION_KEY=your-encryption-key-must-be-at-least-32-characters-long

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Hubex
VITE_APP_VERSION=1.0.0
```

## Development

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run start:dev

# Run tests
npm run test
npm run test:watch
npm run test:cov

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend

# Start development server with HMR
npm run dev

# Run tests
npm run test
npm run test:coverage

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Operations

```bash
cd backend

# Create a new migration
npm run typeorm migration:create src/database/migrations/MigrationName

# Generate migration from entity changes
npm run migration:generate src/database/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## API Documentation

### Swagger/OpenAPI

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

### Example API Requests

#### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

#### 3. Create a Workflow

```bash
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My First Workflow",
    "description": "A simple API workflow",
    "config": {
      "nodes": [
        {
          "id": "1",
          "type": "api",
          "position": { "x": 100, "y": 100 },
          "data": {
            "label": "Get Users",
            "url": "https://jsonplaceholder.typicode.com/users",
            "method": "GET"
          }
        }
      ],
      "edges": []
    }
  }'
```

#### 4. Execute a Workflow

```bash
curl -X POST http://localhost:3000/api/execution/execute/WORKFLOW_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 5. Get Workflow Execution Logs

```bash
curl -X GET http://localhost:3000/api/logs/workflow/WORKFLOW_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Coverage
npm run test:coverage
```

## Deployment

### Backend Production Build

```bash
cd backend

# Build
npm run build

# Start production server
npm run start:prod
```

### Frontend Production Build

```bash
cd frontend

# Build
npm run build

# The optimized files will be in the 'dist' folder
# Serve using any static hosting service (Nginx, Vercel, Netlify, etc.)
```

### Docker Production Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables for Production

Make sure to update the following in production:

- `JWT_SECRET`: Use a strong, random secret
- `JWT_REFRESH_SECRET`: Use a different strong, random secret
- `ENCRYPTION_KEY`: At least 32 characters, random
- `DATABASE_PASSWORD`: Strong database password
- `DATABASE_SSL`: Set to `true`
- `NODE_ENV`: Set to `production`
- `CORS_ORIGIN`: Your frontend domain

## Troubleshooting

### Common Issues

#### Port Already in Use

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists
4. Check firewall settings
5. For Docker: ensure container is healthy

#### CORS Error

1. Verify `CORS_ORIGIN` in backend `.env`
2. Check frontend is running on correct port
3. Ensure credentials are included in requests

#### JWT Token Invalid

1. Check `JWT_SECRET` matches
2. Verify token hasn't expired
3. Check Authorization header format: `Bearer <token>`

#### Docker Issues

```bash
# Rebuild containers
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v

# Check container logs
docker-compose logs backend
docker-compose logs frontend
```

#### Migration Errors

```bash
# Revert last migration
npm run migration:revert

# Check database connection
psql -h localhost -U hubex -d hubex
```

## Roadmap

### Phase 1: MVP (Current)
- [x] Project structure setup
- [x] Database entities design
- [x] Authentication system (JWT)
- [x] User management
- [x] Workflow CRUD operations
- [ ] Basic execution engine
- [ ] Frontend canvas implementation
- [ ] Node components

### Phase 2: Workflow Chaining
- [ ] Multi-node workflow execution
- [ ] Data transformations between nodes
- [ ] Conditional logic (if/else)
- [ ] Error handling and retry logic
- [ ] Variable substitution

### Phase 3: Endpoint Export
- [ ] Export workflows as REST endpoints
- [ ] API key generation for endpoints
- [ ] SDK generation (JavaScript, Python)
- [ ] Webhook support
- [ ] Rate limiting per endpoint

### Phase 4: Logs & Analytics
- [ ] Execution logs with full request/response
- [ ] Analytics dashboard
- [ ] Performance metrics
- [ ] Error tracking and alerting
- [ ] Usage statistics

### Phase 5: Templates & AI
- [ ] Workflow templates library
- [ ] AI-powered workflow suggestions
- [ ] Auto-generate from OpenAPI/Swagger docs
- [ ] Natural language to workflow
- [ ] Community templates marketplace

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Commit your changes**:
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow existing code style
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- **GitHub Issues**: https://github.com/yourusername/hubex/issues
- **Documentation**: Check the docs folder
- **Email**: support@hubex.com

## Acknowledgments

- Built with [NestJS](https://nestjs.com)
- Frontend powered by [React](https://react.dev) and [Vite](https://vitejs.dev)
- Canvas by [React Flow](https://reactflow.dev)
- UI components styled with [TailwindCSS](https://tailwindcss.com)

---

Made with ❤️ by the Hubex Team
