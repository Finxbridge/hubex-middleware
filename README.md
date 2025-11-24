# Hubex - Visual API Integration & Workflow Builder

> Make connecting, managing, and sharing APIs as simple as dragging blocks together.

## Overview

Hubex is a no-code API orchestration platform that lets users visually integrate and manage any external API through an intuitive drag-and-drop interface.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for API integration
- **Multi-Auth Support**: API Key, OAuth2, JWT, Basic Auth, Bearer Token
- **Workflow Execution**: Chain multiple APIs together with conditional logic
- **Reusable Endpoints**: Export workflows as callable REST endpoints
- **Real-time Testing**: Test APIs instantly with JSON response viewer
- **Secure by Default**: AES-256 encryption for credentials

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: Passport.js + JWT
- **API Client**: Axios
- **Encryption**: crypto (AES-256)

### Frontend
- **Framework**: React + TypeScript
- **Canvas**: React Flow
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios

## Project Structure

```
hubex/
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   ├── workflows/   # Workflow CRUD operations
│   │   ├── execution/   # Workflow execution engine
│   │   ├── auth-configs/# Auth configuration management
│   │   ├── logs/        # Execution logs
│   │   ├── common/      # Shared utilities
│   │   └── database/    # Database configuration
│   ├── migrations/      # Database migrations
│   └── test/            # Backend tests
│
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── features/    # Feature-based modules
│   │   ├── store/       # Zustand state management
│   │   ├── services/    # API service layer
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Helper functions
│   │   └── pages/       # Page components
│   └── public/          # Static assets
│
├── docker-compose.yml   # Docker orchestration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hubex.git
cd hubex
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start PostgreSQL (using Docker):
```bash
docker-compose up -d postgres
```

5. Run migrations:
```bash
cd backend
npm run migration:run
```

6. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Using Docker

```bash
docker-compose up
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3000/api/docs

## Development

### Backend Development

```bash
cd backend
npm run start:dev    # Start dev server
npm run test         # Run tests
npm run test:e2e     # Run e2e tests
npm run lint         # Lint code
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
```

## Deployment

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
# Serve the 'dist' folder using any static server
```

## Security

- All credentials encrypted with AES-256
- JWT-based authentication
- HTTPS/TLS for all communications
- Audit logging for all executions
- Role-based access control (RBAC)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/hubex/issues
- Email: support@hubex.com

## Roadmap

- [x] Phase 1: Core Builder + Single API Execution
- [ ] Phase 2: Workflow Chaining
- [ ] Phase 3: Endpoint Export
- [ ] Phase 4: Logs + Analytics
- [ ] Phase 5: Templates + AI Assistant
