# Hubex API Documentation

## Overview

Hubex is a Visual API Integration & Workflow Builder platform that allows you to create, manage, and execute API workflows visually. This documentation provides comprehensive information about the Hubex REST API.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.hubex.io/api`

## Interactive API Documentation

Hubex provides an interactive Swagger UI for exploring and testing the API:

- **Local Development**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Production**: [https://api.hubex.io/api/docs](https://api.hubex.io/api/docs)

### Swagger UI Features

- **Try It Out**: Test API endpoints directly from the browser
- **Request/Response Examples**: View example payloads for all endpoints
- **Authentication**: Easily authenticate with JWT tokens
- **Syntax Highlighting**: Readable JSON with syntax highlighting
- **Filter**: Search and filter endpoints by tags or keywords

## Authentication

Most API endpoints require JWT Bearer authentication. Here's how to authenticate:

### 1. Register a New Account

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 2. Login to Existing Account

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com"
}
```

### 3. Use the Token

Include the JWT token in the Authorization header for all authenticated requests:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login with credentials | No |
| GET | `/auth/profile` | Get authenticated user profile | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/me` | Get current user profile | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PATCH | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user | Yes |

### Workflows

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/workflows` | Create a new workflow | Yes |
| GET | `/workflows` | Get all workflows for user | Yes |
| GET | `/workflows/:id` | Get workflow by ID | Yes |
| PATCH | `/workflows/:id` | Update workflow | Yes |
| DELETE | `/workflows/:id` | Delete workflow | Yes |
| POST | `/workflows/:id/publish` | Publish workflow (make public) | Yes |
| POST | `/workflows/:id/unpublish` | Unpublish workflow | Yes |

### Authentication Configs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth-configs` | Create auth configuration | Yes |
| GET | `/auth-configs` | Get all auth configs | Yes |
| GET | `/auth-configs/:id` | Get auth config by ID | Yes |
| PATCH | `/auth-configs/:id` | Update auth config | Yes |
| DELETE | `/auth-configs/:id` | Delete auth config | Yes |

### Workflow Execution

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/execution/:workflowId` | Execute a private workflow | Yes |
| POST | `/execution/public/:slug` | Execute a published workflow | No |

### Execution Logs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/logs/workflow/:workflowId` | Get logs for a workflow | Yes |
| GET | `/logs/:id` | Get log by ID | Yes |
| GET | `/logs/status/:status` | Get logs by status | Yes |

## Common Use Cases

### Creating and Executing a Workflow

1. **Create a Workflow**

```bash
POST /api/workflows
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "GitHub User Fetcher",
  "description": "Fetches user data from GitHub API",
  "config": {
    "nodes": [
      {
        "id": "1",
        "type": "api",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Get GitHub User",
          "url": "https://api.github.com/users/{{username}}",
          "method": "GET"
        }
      }
    ],
    "edges": []
  },
  "isActive": true
}
```

2. **Execute the Workflow**

```bash
POST /api/execution/YOUR_WORKFLOW_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "input": {
    "username": "octocat"
  }
}
```

3. **Publish for Public Access**

```bash
POST /api/workflows/YOUR_WORKFLOW_ID/publish
Authorization: Bearer YOUR_TOKEN
```

4. **Execute Publicly (No Auth Required)**

```bash
POST /api/execution/public/github-user-fetcher
Content-Type: application/json

{
  "input": {
    "username": "octocat"
  }
}
```

### Configuring External API Authentication

```bash
POST /api/auth-configs
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "OpenAI API Key",
  "type": "api_key",
  "data": {
    "keyName": "Authorization",
    "keyValue": "Bearer sk-abc123...",
    "placement": "header"
  }
}
```

## Workflow Configuration

Workflows are defined using a node-based configuration structure:

### Node Types

- **api**: HTTP API request node
- **auth**: Authentication node
- **logic**: Conditional logic node
- **transform**: Data transformation node
- **output**: Output formatting node

### Example Workflow Config

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "auth",
      "position": { "x": 50, "y": 100 },
      "data": {
        "label": "Authenticate",
        "authConfigId": "auth-config-uuid"
      }
    },
    {
      "id": "2",
      "type": "api",
      "position": { "x": 250, "y": 100 },
      "data": {
        "label": "Fetch Data",
        "url": "https://api.example.com/data",
        "method": "GET",
        "headers": {
          "Content-Type": "application/json"
        }
      }
    },
    {
      "id": "3",
      "type": "transform",
      "position": { "x": 450, "y": 100 },
      "data": {
        "label": "Transform Response",
        "transform": "data.items.map(item => item.name)"
      }
    },
    {
      "id": "4",
      "type": "output",
      "position": { "x": 650, "y": 100 },
      "data": {
        "label": "Format Output",
        "format": "json"
      }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" },
    { "id": "e2-3", "source": "2", "target": "3" },
    { "id": "e3-4", "source": "3", "target": "4" }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource created |
| 204 | Success with no content |
| 400 | Bad request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Access denied |
| 404 | Not found |
| 500 | Internal server error |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Public workflow execution**: 100 requests per hour per IP

## Best Practices

1. **Store tokens securely**: Never expose JWT tokens in client-side code
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate inputs**: Validate all workflow inputs before execution
4. **Handle errors**: Implement proper error handling for all API calls
5. **Monitor logs**: Regularly check execution logs for issues
6. **Test workflows**: Test workflows thoroughly before publishing

## Testing with Swagger UI

1. Open the Swagger UI at [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
2. Click the **Authorize** button at the top right
3. Enter your JWT token in the format: `Bearer YOUR_TOKEN`
4. Click **Authorize** and then **Close**
5. Expand any endpoint and click **Try it out**
6. Fill in the required parameters
7. Click **Execute** to test the endpoint

The Swagger UI will show you:
- Request URL and headers
- Response body, headers, and status code
- Example values for all parameters

## Environment Variables

Configure the following environment variables:

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

## Support

For issues, questions, or feature requests:
- Email: support@hubex.io
- GitHub: https://github.com/your-repo/hubex
- Documentation: https://docs.hubex.io

## License

MIT License - See LICENSE file for details
