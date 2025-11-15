#!/usr/bin/env ts-node
/**
 * API Documentation Generator
 * Generates markdown documentation from OpenAPI/NestJS decorators
 *
 * Usage: pnpm run generate:api-docs
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface OpenAPIEndpoint {
  path: string;
  method: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters?: any[];
  requestBody?: any;
  responses: Record<string, any>;
  security?: any[];
}

interface OpenAPISpec {
  openapi: string;
  info: any;
  servers: any[];
  paths: Record<string, Record<string, OpenAPIEndpoint>>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  tags: any[];
}

const DOCS_API_DIR = path.join(process.cwd(), 'docs', 'api');
const DOCS_API_REFERENCE_DIR = path.join(DOCS_API_DIR, 'reference');

function main() {
  console.log('📝 Generating API documentation...\n');

  // Create directories if they don't exist
  [DOCS_API_DIR, DOCS_API_REFERENCE_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });

  // Generate OpenAPI spec from NestJS app
  console.log('🔧 Extracting OpenAPI specification from NestJS...');

  // TODO: This requires the NestJS app to be built
  // For now, create a placeholder that will be replaced by actual implementation

  const timestamp = new Date().toISOString().split('T')[0];

  // Create placeholder API documentation
  const apiEndpointsDoc = `# API Endpoints Reference

**Last Updated**: ${timestamp}  
**Version**: 1.0.0  
**Status**: Auto-generated from OpenAPI specification

---

## Overview

This document is auto-generated from the NestJS OpenAPI decorators.  
For the complete OpenAPI specification, see the Swagger UI at \`/api/docs\`.

## Base URL

- **Development**: \`http://localhost:3001/api/v1\`
- **Staging**: \`https://staging.kompass.de/api/v1\`
- **Production**: \`https://api.kompass.de/api/v1\`

## Authentication

All endpoints require JWT Bearer token authentication unless otherwise specified.

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Endpoints

### Customers

#### List Customers
\`\`\`
GET /api/v1/customers
\`\`\`

**Description**: List all customers with optional filtering and pagination.

**Query Parameters**:
- \`page\` (number, optional): Page number (default: 1)
- \`pageSize\` (number, optional): Items per page (default: 20, max: 100)
- \`search\` (string, optional): Search by company name, VAT number, or city
- \`rating\` (string, optional): Filter by rating (A, B, C)
- \`sortBy\` (string, optional): Sort field (default: companyName)
- \`sortOrder\` (string, optional): Sort order (asc, desc)

**Response**: \`200 OK\`
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
\`\`\`

**Permissions Required**: \`Customer.READ\`

---

#### Get Customer by ID
\`\`\`
GET /api/v1/customers/:id
\`\`\`

**Description**: Get a single customer by ID.

**Path Parameters**:
- \`id\` (string, required): Customer ID

**Response**: \`200 OK\`
\`\`\`json
{
  "id": "customer-550e8400-e29b-41d4-a716-446655440000",
  "companyName": "Hofladen Müller GmbH",
  "vatNumber": "DE123456789",
  "email": "info@hofladen-mueller.de",
  "phone": "+49-89-1234567",
  "billingAddress": {
    "street": "Hauptstraße 15",
    "zipCode": "80331",
    "city": "München",
    "country": "Deutschland"
  },
  "rating": "A",
  "owner": "user-123",
  "createdAt": "2024-01-15T10:30:00Z",
  "modifiedAt": "2024-01-20T14:45:00Z"
}
\`\`\`

**Error Responses**:
- \`404 Not Found\`: Customer not found
- \`403 Forbidden\`: Insufficient permissions

**Permissions Required**: \`Customer.READ\`

---

#### Create Customer
\`\`\`
POST /api/v1/customers
\`\`\`

**Description**: Create a new customer.

**Request Body**:
\`\`\`json
{
  "companyName": "Hofladen Müller GmbH",
  "vatNumber": "DE123456789",
  "email": "info@hofladen-mueller.de",
  "phone": "+49-89-1234567",
  "billingAddress": {
    "street": "Hauptstraße 15",
    "zipCode": "80331",
    "city": "München",
    "country": "Deutschland"
  },
  "customerBusinessType": "direct_marketer",
  "creditLimit": 50000
}
\`\`\`

**Response**: \`201 Created\`

**Error Responses**:
- \`400 Bad Request\`: Validation error
- \`409 Conflict\`: Duplicate customer detected

**Permissions Required**: \`Customer.CREATE\`

---

## Error Response Format (RFC 7807)

All errors follow the RFC 7807 Problem Details format:

\`\`\`json
{
  "type": "https://api.kompass.de/errors/validation-error",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Company name must be 2-200 characters",
  "instance": "/api/v1/customers",
  "errors": [
    {
      "field": "companyName",
      "message": "Company name must be 2-200 characters",
      "value": "A"
    }
  ]
}
\`\`\`

## Related Documentation

- [API Specification](../../specifications/API_SPECIFICATION.md) - Technical specification
- [Authentication Guide](./authentication.md) - Authentication details
- [API Updates](../updates/API_UPDATES.md) - Version changelog

---

**Generated on**: ${timestamp}  
**Generator**: \`scripts/generate-api-docs.ts\`
`;

  // Write the API endpoints documentation
  const endpointsPath = path.join(DOCS_API_REFERENCE_DIR, 'endpoints.md');
  fs.writeFileSync(endpointsPath, apiEndpointsDoc);
  console.log(`✅ Generated: ${endpointsPath}`);

  // Create authentication documentation
  const authDoc = `# Authentication & Authorization

**Last Updated**: ${timestamp}

## Overview

KOMPASS uses JWT (JSON Web Token) based authentication with Keycloak as the identity provider.

## Authentication Flow

1. User logs in via Keycloak
2. Keycloak issues JWT token
3. Client includes token in \`Authorization\` header
4. Backend validates token and extracts user information
5. RBAC guard checks permissions for requested resource

## JWT Token Format

\`\`\`
Authorization: Bearer <jwt-token>
\`\`\`

## Token Structure

The JWT token contains:
- \`sub\`: User ID
- \`email\`: User email
- \`role\`: User role (ADM, INNEN, PLAN, BUCH, GF)
- \`iat\`: Issued at timestamp
- \`exp\`: Expiration timestamp

## RBAC Permissions

See [RBAC Permission Matrix](../../specifications/RBAC_PERMISSION_MATRIX.md) for complete permission matrix.

## Error Responses

### 401 Unauthorized
\`\`\`json
{
  "type": "https://api.kompass.de/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid or missing authentication token"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "type": "https://api.kompass.de/errors/forbidden",
  "title": "Forbidden",
  "status": 403,
  "detail": "You do not have permission to access this resource"
}
\`\`\`

## Related Documentation

- [RBAC Permission Matrix](../../specifications/RBAC_PERMISSION_MATRIX.md)
- [API Endpoints](./endpoints.md)

---

**Generated on**: ${timestamp}
`;

  const authPath = path.join(DOCS_API_REFERENCE_DIR, 'authentication.md');
  fs.writeFileSync(authPath, authDoc);
  console.log(`✅ Generated: ${authPath}`);

  console.log('\n✅ API documentation generation complete!\n');
  console.log('📄 Generated files:');
  console.log('   - docs/api/reference/endpoints.md');
  console.log('   - docs/api/reference/authentication.md');
  console.log('\n💡 Note: This is a placeholder implementation.');
  console.log(
    '   Once the NestJS backend is implemented, this script will extract'
  );
  console.log('   actual OpenAPI specifications from Swagger decorators.');
}

if (require.main === module) {
  main();
}

export { main as generateApiDocs };
