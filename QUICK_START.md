# Hubex - Quick Start Guide

This guide will help you get Hubex up and running quickly.

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Docker (optional but recommended)

## Option 1: Docker Setup (Recommended)

This is the fastest way to get started.

### Step 1: Clone and Navigate
```bash
cd c:\Projects\Hubex
```

### Step 2: Start All Services
```bash
docker-compose up
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3000)
- Frontend (port 5173)

### Step 3: Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs

## Option 2: Manual Setup

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=hubex
DATABASE_PASSWORD=your_password
DATABASE_NAME=hubex
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
ENCRYPTION_KEY=your-encryption-key-must-be-at-least-32-characters-long
```

5. Start PostgreSQL:
```bash
# Using Docker
docker run --name hubex-postgres -e POSTGRES_DB=hubex -e POSTGRES_USER=hubex -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:15-alpine

# Or use your local PostgreSQL installation
```

6. Run migrations (when implemented):
```bash
npm run migration:run
```

7. Start backend:
```bash
npm run start:dev
```

Backend will be available at http://localhost:3000

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

5. Start frontend:
```bash
npm run dev
```

Frontend will be available at http://localhost:5173

## Testing the Application

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type": application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Create a Workflow

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
        },
        {
          "id": "2",
          "type": "output",
          "position": { "x": 300, "y": 100 },
          "data": {
            "label": "Output",
            "format": "json"
          }
        }
      ],
      "edges": [
        {
          "id": "e1-2",
          "source": "1",
          "target": "2"
        }
      ]
    }
  }'
```

### 4. Get All Workflows

```bash
curl -X GET http://localhost:3000/api/workflows \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Project Structure

```
hubex/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── workflows/      # Workflow CRUD
│   │   ├── auth-configs/   # Auth configuration
│   │   ├── execution/      # Workflow execution engine
│   │   ├── logs/           # Execution logs
│   │   ├── common/         # Shared utilities
│   │   └── database/       # Database config
│   ├── package.json
│   └── .env
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature modules
│   │   ├── store/         # Zustand state
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── pages/         # Page components
│   │   └── App.tsx
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
└── README.md
```

## Key Features to Implement

### Phase 1 (MVP) - Current
- [x] Project structure
- [x] Database entities
- [x] Authentication (JWT)
- [x] User management
- [x] Workflow CRUD
- [ ] Basic execution engine
- [ ] Frontend canvas
- [ ] Node components

### Phase 2
- [ ] Multi-node chaining
- [ ] Data transformations
- [ ] Conditional logic
- [ ] Error handling

### Phase 3
- [ ] Public endpoint export
- [ ] SDK generation
- [ ] Webhook support

### Phase 4
- [ ] Execution logs
- [ ] Analytics dashboard
- [ ] Performance metrics

### Phase 5
- [ ] Workflow templates
- [ ] AI assistant
- [ ] Auto-generate from API docs

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find and kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: Database Connection Failed
1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Ensure database exists
4. Check firewall settings

### Issue: CORS Error
1. Verify `CORS_ORIGIN` in backend `.env`
2. Check frontend is running on correct port
3. Ensure credentials are included in requests

### Issue: JWT Token Invalid
1. Check `JWT_SECRET` matches between requests
2. Verify token hasn't expired
3. Check Authorization header format: `Bearer <token>`

## Development Workflow

### Making Changes

1. **Backend Changes:**
```bash
cd backend
# Code auto-reloads with nest start --watch
npm run start:dev
```

2. **Frontend Changes:**
```bash
cd frontend
# Vite hot-reload is automatic
npm run dev
```

3. **Database Changes:**
```bash
cd backend
# Create migration
npm run typeorm migration:create src/database/migrations/MigrationName
# Run migrations
npm run migration:run
```

### Running Tests

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
```

### Building for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
# Serve the dist/ folder
```

## Next Steps

1. **Complete Backend Implementation:**
   - Finish execution engine
   - Implement auth-configs module
   - Add logging module
   - Create database migrations

2. **Build Frontend:**
   - Follow `frontend/FRONTEND_FILES.md` for complete implementation
   - Create all components
   - Implement canvas with React Flow
   - Build node configurators

3. **Test Everything:**
   - Create test workflows
   - Test API endpoints
   - Verify execution engine
   - Test authentication flow

4. **Deploy:**
   - Set up production database
   - Configure environment variables
   - Deploy backend to cloud
   - Deploy frontend to CDN

## Resources

- **NestJS Docs:** https://docs.nestjs.com
- **React Flow Docs:** https://reactflow.dev
- **Zustand Docs:** https://github.com/pmndrs/zustand
- **TailwindCSS:** https://tailwindcss.com
- **TypeORM:** https://typeorm.io

## Support

For issues:
1. Check this guide
2. Review error logs
3. Check `IMPLEMENTATION_GUIDE.md`
4. Check `BACKEND_STRUCTURE.md`
5. Check `frontend/FRONTEND_FILES.md`

Happy coding! 🚀
