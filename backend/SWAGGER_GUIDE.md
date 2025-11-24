# Swagger UI Quick Start Guide

## Accessing Swagger UI

Once your backend is running, access the Swagger UI at:

**Local Development**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Features

### 1. Interactive API Testing

Swagger UI provides a complete interactive interface to test all API endpoints directly from your browser.

### 2. Authentication Setup

Most endpoints require JWT authentication. Here's how to authenticate:

#### Step 1: Register or Login

1. Scroll to the **auth** section
2. Click on `POST /auth/register` or `POST /auth/login`
3. Click **Try it out**
4. Fill in the request body:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

5. Click **Execute**
6. Copy the `access_token` from the response

#### Step 2: Authorize

1. Click the **Authorize** button (lock icon) at the top right of the page
2. Enter your token in this format: `Bearer YOUR_ACCESS_TOKEN`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **Authorize**
4. Click **Close**

Now you're authenticated and can test protected endpoints!

### 3. Testing Endpoints

#### Example: Create a Workflow

1. Navigate to the **workflows** section
2. Click on `POST /workflows`
3. Click **Try it out**
4. Modify the request body with your workflow configuration:

```json
{
  "name": "GitHub User Fetcher",
  "description": "Fetches GitHub user data",
  "config": {
    "nodes": [
      {
        "id": "1",
        "type": "api",
        "position": { "x": 100, "y": 100 },
        "data": {
          "label": "Get GitHub User",
          "url": "https://api.github.com/users/octocat",
          "method": "GET"
        }
      }
    ],
    "edges": []
  },
  "isActive": true
}
```

5. Click **Execute**
6. View the response below

#### Example: Execute a Workflow

1. Copy the workflow `id` from the previous response
2. Navigate to `POST /execution/{workflowId}`
3. Click **Try it out**
4. Enter the workflow ID in the path parameter
5. Provide input data in the request body:

```json
{
  "input": {
    "username": "octocat"
  }
}
```

6. Click **Execute**
7. View the execution results

### 4. Understanding Response Codes

Swagger shows you the possible response codes for each endpoint:

- **200**: Success
- **201**: Created successfully
- **204**: Success with no content
- **400**: Bad request (validation error)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (access denied)
- **404**: Not found
- **500**: Server error

### 5. Request Examples

Each endpoint shows example request bodies and parameters. Click **Try it out** to see editable examples.

### 6. Response Examples

After executing a request, Swagger shows:
- Response body (with syntax highlighting)
- Response headers
- HTTP status code
- Request duration

### 7. Schema Information

Click on any model name (in blue) to see detailed schema information including:
- Property names and types
- Required vs optional fields
- Validation rules
- Example values

## Common Workflows

### Testing the Complete Flow

1. **Register**: `POST /auth/register`
2. **Authorize**: Use the token from step 1
3. **Create Auth Config**: `POST /auth-configs` (if using external APIs)
4. **Create Workflow**: `POST /workflows`
5. **Execute Workflow**: `POST /execution/{workflowId}`
6. **View Logs**: `GET /logs/workflow/{workflowId}`
7. **Publish Workflow**: `POST /workflows/{id}/publish`
8. **Execute Public Workflow**: `POST /execution/public/{slug}` (no auth needed)

### Testing Public Workflows

Public workflows don't require authentication:

1. Create and publish a workflow while authenticated
2. Log out or open an incognito window
3. Access Swagger UI
4. Go to `POST /execution/public/{slug}`
5. Enter the workflow slug
6. Execute without authentication

## Swagger UI Configuration

The Swagger UI is configured with the following features:

- **Persist Authorization**: Your JWT token is saved in the browser
- **Syntax Highlighting**: Monokai theme for better readability
- **Try It Out**: Enabled by default for all endpoints
- **Request Duration**: Shows how long each request takes
- **Filter**: Search bar to quickly find endpoints
- **Dark Theme**: Custom CSS for better visual experience

## Tips

1. **Use the Filter**: Type in the search bar to quickly find endpoints
2. **Expand All**: Click endpoint titles to expand/collapse sections
3. **Copy Responses**: Use the copy button to copy response JSON
4. **Download OpenAPI Spec**: Access the raw spec at `/api/docs-json`
5. **Curl Commands**: Swagger generates curl commands for each request

## Troubleshooting

### "Unauthorized" Error

- Make sure you've clicked **Authorize** and entered your token
- Ensure the token includes the "Bearer " prefix
- Check that your token hasn't expired (default: 7 days)

### Request Validation Errors

- Check the schema to ensure all required fields are present
- Verify data types match the schema
- Look for validation rules (min/max length, email format, etc.)

### CORS Errors

- Ensure your frontend origin is added to `CORS_ORIGIN` in .env
- Check that the API is running on the correct port

## Advanced Usage

### Using the OpenAPI Specification

Download the OpenAPI spec for use with other tools:

```bash
curl http://localhost:3000/api/docs-json > openapi.json
```

Use this with:
- Postman (import collection)
- Insomnia (import spec)
- Code generators (OpenAPI Generator)
- API testing tools

### Testing with Multiple Servers

The Swagger config includes multiple server URLs. Switch between them using the "Servers" dropdown:
- Local Development: `http://localhost:3000`
- Production: `https://api.hubex.io`

## Next Steps

After testing with Swagger:

1. Integrate the API into your frontend application
2. Review the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint information
3. Check error handling and edge cases
4. Monitor execution logs for issues
5. Set up proper authentication flows in your client

## Support

If you encounter issues with the Swagger documentation:
- Check the console for errors
- Verify the backend is running
- Review the OpenAPI spec at `/api/docs-json`
- Report issues on GitHub
