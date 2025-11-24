# Hubex Backend Structure

This document outlines the complete backend structure. Due to file size, I'm providing a comprehensive overview of all remaining files that need to be created.

## Completed Files
- ✅ Main application files (main.ts, app.module.ts)
- ✅ Database entities (User, Workflow, AuthConfig, ExecutionLog)
- ✅ Common module (EncryptionService, HttpClientService)
- ✅ Users module (complete with service, controller, DTOs)
- ✅ Auth module (complete with JWT/Passport strategies)

## Remaining Files to Create

### 1. Workflows Module
Files in `src/workflows/`:
- `workflows.service.ts` - CRUD operations for workflows
- `workflows.controller.ts` - REST API endpoints
- `dto/create-workflow.dto.ts` - Create DTO
- `dto/update-workflow.dto.ts` - Update DTO

### 2. Auth Configs Module
Files in `src/auth-configs/`:
- `auth-configs.module.ts`
- `auth-configs.service.ts` - Manage auth configurations with encryption
- `auth-configs.controller.ts`
- `dto/create-auth-config.dto.ts`
- `dto/update-auth-config.dto.ts`

### 3. Execution Module (Core Engine)
Files in `src/execution/`:
- `execution.module.ts`
- `execution.service.ts` - Main workflow execution orchestrator
- `execution.controller.ts` - Execute workflow endpoint
- `processors/` - Node processors
  - `base-processor.ts` - Abstract base class
  - `auth-processor.ts` - Process auth nodes
  - `api-processor.ts` - Execute API calls
  - `transform-processor.ts` - Data transformation
  - `logic-processor.ts` - Conditional logic
  - `output-processor.ts` - Output formatting
- `dto/execute-workflow.dto.ts`

### 4. Logs Module
Files in `src/logs/`:
- `logs.module.ts`
- `logs.service.ts` - Query and manage execution logs
- `logs.controller.ts` - View logs endpoint

### 5. Database Configuration
Files in `src/database/`:
- `data-source.ts` - TypeORM configuration for migrations

## Key Implementation Details

### Workflow Execution Flow
```
1. User triggers workflow execution
2. ExecutionService fetches workflow config
3. Parse nodes and edges into execution graph
4. Resolve node dependencies
5. Execute nodes in order:
   - Auth nodes: Prepare authentication
   - API nodes: Make HTTP requests with auth
   - Transform nodes: Manipulate response data
   - Logic nodes: Conditional branching
   - Output nodes: Format final result
6. Log each step
7. Return final output
```

### Node Processor Pattern
Each node type has a dedicated processor implementing:
```typescript
abstract class BaseProcessor {
  abstract process(node: WorkflowNode, context: ExecutionContext): Promise<any>;
}
```

### Security Features
- Auth credentials encrypted before storage
- Decrypted only during execution
- JWT tokens for API authentication
- Request/response logging (sanitized)

## Next Steps
After creating these files, you'll have:
1. Complete backend API
2. Workflow execution engine
3. Full CRUD for all resources
4. Secure credential management
5. Execution logging and monitoring

Then proceed with frontend development.
