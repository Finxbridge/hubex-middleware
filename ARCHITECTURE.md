# Hubex System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 5173)                 │    │
│  │                                                          │    │
│  │  ├── Pages (Dashboard, Workflow Editor, Auth)          │    │
│  │  ├── Components (Canvas, Nodes, Forms)                 │    │
│  │  ├── State (Zustand - Auth, Workflows, Canvas)         │    │
│  │  ├── Services (API Client with Axios)                  │    │
│  │  └── Routing (React Router)                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                            ↕ HTTPS/REST API                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            NestJS Backend (Port 3000)                   │    │
│  │                                                          │    │
│  │  API Gateway (Express + Passport + JWT)                │    │
│  │           ↓                                              │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │           Module Layer                            │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌────────────┐  ┌──────────────┐               │  │    │
│  │  │  │    Auth    │  │    Users     │               │  │    │
│  │  │  │  Module    │  │   Module     │               │  │    │
│  │  │  └────────────┘  └──────────────┘               │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌────────────┐  ┌──────────────┐               │  │    │
│  │  │  │ Workflows  │  │ Auth Configs │               │  │    │
│  │  │  │  Module    │  │   Module     │               │  │    │
│  │  │  └────────────┘  └──────────────┘               │  │    │
│  │  │                                                    │  │    │
│  │  │  ┌────────────┐  ┌──────────────┐               │  │    │
│  │  │  │ Execution  │  │    Logs      │               │  │    │
│  │  │  │  Engine    │  │   Module     │               │  │    │
│  │  │  └────────────┘  └──────────────┘               │  │    │
│  │  │                                                    │  │    │
│  │  │         Common Module (Shared Services)          │  │    │
│  │  │    ┌────────────────┐  ┌─────────────────┐      │  │    │
│  │  │    │   Encryption   │  │  HTTP Client    │      │  │    │
│  │  │    │    Service     │  │    Service      │      │  │    │
│  │  │    └────────────────┘  └─────────────────┘      │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
│                            ↕                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐            │
│  │   PostgreSQL     │         │      Redis       │            │
│  │   (Port 5432)    │         │   (Port 6379)    │            │
│  │                  │         │                  │            │
│  │  • users         │         │  • Sessions      │            │
│  │  • workflows     │         │  • Cache         │            │
│  │  • auth_configs  │         │  • Rate Limit    │            │
│  │  • exec_logs     │         │                  │            │
│  └──────────────────┘         └──────────────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  OpenAI  │  │  Slack   │  │  Notion  │  │  Any API │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                      ↑ HTTP Requests ↑                          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User (Browser)
    │
    ├─→ POST /api/auth/register
    │       └─→ UsersService.create()
    │           └─→ bcrypt.hash(password)
    │               └─→ Save to PostgreSQL
    │                   └─→ Return JWT token
    │
    ├─→ POST /api/auth/login
    │       └─→ AuthService.validateUser()
    │           └─→ bcrypt.compare(password)
    │               └─→ JwtService.sign()
    │                   └─→ Return JWT token
    │
    └─→ All subsequent requests
            └─→ Headers: { Authorization: "Bearer <token>" }
                └─→ JwtAuthGuard validates token
                    └─→ Request proceeds if valid
```

### 2. Workflow Creation Flow

```
User (Canvas)
    │
    ├─→ Drag nodes onto canvas
    │   └─→ CanvasStore updates nodes[]
    │
    ├─→ Connect nodes
    │   └─→ CanvasStore updates edges[]
    │
    ├─→ Configure each node
    │   └─→ NodeInspector updates node.data
    │
    └─→ Click "Save"
        └─→ POST /api/workflows
            └─→ WorkflowsService.create()
                └─→ Validate config
                    └─→ Generate slug
                        └─→ Save to PostgreSQL
                            └─→ Return Workflow object
```

### 3. Workflow Execution Flow

```
User Triggers Execution
    │
    ├─→ POST /api/execution/:workflowId
    │   └─→ ExecutionService.execute()
    │       │
    │       ├─→ Load workflow from DB
    │       │
    │       ├─→ Parse nodes and edges
    │       │   └─→ Build dependency graph
    │       │
    │       ├─→ Resolve execution order
    │       │   └─→ Topological sort
    │       │
    │       └─→ Execute nodes sequentially:
    │           │
    │           ├─→ Auth Node
    │           │   └─→ AuthProcessor.process()
    │           │       └─→ Load encrypted auth config
    │           │           └─→ Decrypt credentials
    │           │               └─→ Store in execution context
    │           │
    │           ├─→ API Node
    │           │   └─→ ApiProcessor.process()
    │           │       └─→ Get auth from context
    │           │           └─→ HttpClientService.request()
    │           │               ├─→ Apply auth (API key/OAuth/etc)
    │           │               ├─→ Make HTTP request
    │           │               └─→ Return response
    │           │
    │           ├─→ Transform Node
    │           │   └─→ TransformProcessor.process()
    │           │       └─→ Apply transformations
    │           │           └─→ Map/filter/reduce data
    │           │
    │           ├─→ Logic Node
    │           │   └─→ LogicProcessor.process()
    │           │       └─→ Evaluate condition
    │           │           └─→ Branch execution
    │           │
    │           └─→ Output Node
    │               └─→ OutputProcessor.process()
    │                   └─→ Format result
    │                       └─→ Return final output
    │
    └─→ Log execution to database
        └─→ Return result to user
```

### 4. Authentication Configuration Storage

```
User Configures Auth
    │
    ├─→ POST /api/auth-configs
    │   └─→ AuthConfigsService.create()
    │       │
    │       ├─→ Receive plain auth data:
    │       │   {
    │       │     type: "api_key",
    │       │     data: {
    │       │       keyName: "Authorization",
    │       │       keyValue: "sk-abc123..."
    │       │     }
    │       │   }
    │       │
    │       ├─→ EncryptionService.encryptObject(data)
    │       │   └─→ AES-256-GCM encryption
    │       │       └─→ Returns: "iv:encrypted:authTag"
    │       │
    │       └─→ Save encrypted data to PostgreSQL
    │
    └─→ During Execution:
        └─→ AuthConfigsService.findOne()
            └─→ Load encrypted data from DB
                └─→ EncryptionService.decryptObject()
                    └─→ Return plain auth data
                        └─→ Use in HTTP requests
```

## Module Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                     AppModule                            │
│  ┌────────────────────────────────────────────────┐    │
│  │              ConfigModule (Global)              │    │
│  │              TypeOrmModule (Global)             │    │
│  │              CommonModule (Global)              │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  AuthModule  │  │ UsersModule  │                    │
│  │              │  │              │                    │
│  │  Imports:    │  │  Exports:    │                    │
│  │  - Users     │←─┤  - UsersService                   │
│  │  - JWT       │  │              │                    │
│  │  - Passport  │  │              │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Workflows    │  │ AuthConfigs  │                    │
│  │   Module     │  │    Module    │                    │
│  │              │  │              │                    │
│  │  Protected   │  │  Protected   │                    │
│  │  by JWT      │  │  by JWT      │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │         ExecutionModule               │              │
│  │                                       │              │
│  │  Imports:                             │              │
│  │  - Workflows (load configs)           │              │
│  │  - AuthConfigs (load auth)            │              │
│  │  - Logs (save execution)              │              │
│  │  - Common (HTTP + Encryption)         │              │
│  │                                       │              │
│  │  Contains:                            │              │
│  │  - ExecutionService (orchestrator)    │              │
│  │  - Node Processors (auth/api/etc)     │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────┐                                       │
│  │ LogsModule   │                                       │
│  │              │                                       │
│  │  Query logs  │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Stack                        │
│                                                          │
│  Layer 1: Network                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  • HTTPS/TLS encryption                         │    │
│  │  • CORS policy enforcement                      │    │
│  │  • Rate limiting (planned)                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 2: Authentication                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │  • JWT token validation                         │    │
│  │  • Passport strategies                          │    │
│  │  • Token expiration (24h)                       │    │
│  │  • Refresh tokens (planned)                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 3: Authorization                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  • User owns resource check                     │    │
│  │  • JwtAuthGuard on protected routes             │    │
│  │  • Role-based access (planned)                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 4: Data Protection                                │
│  ┌────────────────────────────────────────────────┐    │
│  │  • Password hashing (bcrypt)                    │    │
│  │  • Credential encryption (AES-256-GCM)          │    │
│  │  • Encrypted database fields                    │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Layer 5: Input Validation                               │
│  ┌────────────────────────────────────────────────┐    │
│  │  • class-validator on DTOs                      │    │
│  │  • TypeORM parameterized queries                │    │
│  │  • Sanitization of outputs                      │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workflows Table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    is_published BOOLEAN DEFAULT false,
    slug VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Auth Configs Table
CREATE TABLE auth_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    encrypted BOOLEAN DEFAULT true,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Execution Logs Table
CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    request JSONB,
    response JSONB,
    node_executions JSONB,
    duration INTEGER,
    error JSONB,
    input JSONB,
    output JSONB,
    executed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_workflows_slug ON workflows(slug);
CREATE INDEX idx_auth_configs_user_id ON auth_configs(user_id);
CREATE INDEX idx_execution_logs_workflow_id ON execution_logs(workflow_id);
CREATE INDEX idx_execution_logs_executed_at ON execution_logs(executed_at);
```

## Frontend State Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend State                          │
│                                                          │
│  Global State (Zustand)                                  │
│  ┌────────────────────────────────────────────────┐    │
│  │  authStore                                      │    │
│  │  ├── user                                       │    │
│  │  ├── token                                      │    │
│  │  ├── isAuthenticated                            │    │
│  │  └── methods: login, logout, updateUser         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  workflowStore                                  │    │
│  │  ├── workflows[]                                │    │
│  │  ├── currentWorkflow                            │    │
│  │  └── methods: CRUD operations                   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  canvasStore                                    │    │
│  │  ├── nodes[]                                    │    │
│  │  ├── edges[]                                    │    │
│  │  └── methods: React Flow handlers               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Server State (React Query)                              │
│  ┌────────────────────────────────────────────────┐    │
│  │  useQuery('workflows')                          │    │
│  │  useQuery('workflow/:id')                       │    │
│  │  useMutation('createWorkflow')                  │    │
│  │  useMutation('executeWorkflow')                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                     Production                           │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  CDN (Cloudflare/CloudFront)                    │    │
│  │  └─→ Static files (React build)                 │    │
│  └────────────────────────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Load Balancer                                  │    │
│  │  └─→ SSL Termination                            │    │
│  └────────────────────────────────────────────────┘    │
│                    ↓                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  NestJS Instances (Auto-scaling)                │    │
│  │  ├─→ Container 1                                │    │
│  │  ├─→ Container 2                                │    │
│  │  └─→ Container N                                │    │
│  └────────────────────────────────────────────────┘    │
│                    ↓                                     │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │  RDS PostgreSQL  │         │  ElastiCache     │    │
│  │  (Multi-AZ)      │         │  Redis           │    │
│  └──────────────────┘         └──────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

This architecture is designed to be:
- **Scalable**: Horizontal scaling via containers
- **Secure**: Multiple security layers
- **Maintainable**: Clear separation of concerns
- **Performant**: Caching and optimized queries
- **Reliable**: Health checks and auto-recovery
