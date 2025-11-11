#!/bin/bash

###############################################################################
# Generate NestJS Module Script for KOMPASS
#
# Usage: ./scripts/generate-module.sh <entity-name>
# Example: ./scripts/generate-module.sh customer
#
# Generates:
# - Module file
# - Controller with RBAC guards
# - Service with business logic
# - Repository with CouchDB operations
# - DTOs (create, update, response)
# - Entity interface
# - Unit tests
#
# Following: KOMPASS architecture patterns and DATA_MODEL_SPECIFICATION.md
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Entity name required${NC}"
    echo "Usage: ./scripts/generate-module.sh <entity-name>"
    echo "Example: ./scripts/generate-module.sh customer"
    exit 1
fi

ENTITY_NAME_LOWER=$(echo "$1" | tr '[:upper:]' '[:lower:]')
ENTITY_NAME_PASCAL=$(echo "$1" | sed 's/\b\(.\)/\u\1/g')
ENTITY_NAME_PLURAL="${ENTITY_NAME_LOWER}s"
ENTITY_NAME_PLURAL_PASCAL="${ENTITY_NAME_PASCAL}s"

echo -e "${GREEN}Generating NestJS module for: ${ENTITY_NAME_PASCAL}${NC}"
echo "Entity: ${ENTITY_NAME_PASCAL}"
echo "Lowercase: ${ENTITY_NAME_LOWER}"
echo "Plural: ${ENTITY_NAME_PLURAL}"
echo ""

# Base directory
MODULE_DIR="apps/backend/src/modules/${ENTITY_NAME_LOWER}"

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "${MODULE_DIR}/dto"
mkdir -p "${MODULE_DIR}/entities"
mkdir -p "${MODULE_DIR}/__tests__"

# Read templates
ENTITY_TEMPLATE=$(cat templates/backend/entity.template.ts)
SERVICE_TEMPLATE=$(cat templates/backend/service.template.ts)
CONTROLLER_TEMPLATE=$(cat templates/backend/controller.template.ts)
REPOSITORY_TEMPLATE=$(cat templates/backend/repository.template.ts)
CREATE_DTO_TEMPLATE=$(cat templates/backend/dto/create-dto.template.ts)
UPDATE_DTO_TEMPLATE=$(cat templates/backend/dto/update-dto.template.ts)
RESPONSE_DTO_TEMPLATE=$(cat templates/backend/dto/response-dto.template.ts)
UNIT_TEST_TEMPLATE=$(cat templates/tests/unit-test.template.spec.ts)

# Replace placeholders function
replace_placeholders() {
    echo "$1" | sed \
        -e "s/{{ENTITY_NAME}}/${ENTITY_NAME_PASCAL}/g" \
        -e "s/{{ENTITY_NAME_LOWER}}/${ENTITY_NAME_LOWER}/g" \
        -e "s/{{ENTITY_NAME_PLURAL}}/${ENTITY_NAME_PLURAL_PASCAL}/g" \
        -e "s/{{ENTITY_NAME_PLURAL_LOWER}}/${ENTITY_NAME_PLURAL}/g" \
        -e "s/{{DATABASE_NAME}}/kompass/g" \
        -e "s/{{ENTITY_DESCRIPTION}}/Represents a ${ENTITY_NAME_LOWER} entity/g" \
        -e "s/{{ENTITY_CODE}}/$(echo ${ENTITY_NAME_PASCAL} | cut -c1-3 | tr '[:lower:]' '[:upper:]')/g"
}

# Generate entity
echo -e "${YELLOW}Generating entity...${NC}"
replace_placeholders "$ENTITY_TEMPLATE" > "${MODULE_DIR}/entities/${ENTITY_NAME_LOWER}.entity.ts"

# Generate repository
echo -e "${YELLOW}Generating repository...${NC}"
replace_placeholders "$REPOSITORY_TEMPLATE" > "${MODULE_DIR}/${ENTITY_NAME_LOWER}.repository.ts"

# Generate service
echo -e "${YELLOW}Generating service...${NC}"
replace_placeholders "$SERVICE_TEMPLATE" > "${MODULE_DIR}/${ENTITY_NAME_LOWER}.service.ts"

# Generate controller
echo -e "${YELLOW}Generating controller...${NC}"
replace_placeholders "$CONTROLLER_TEMPLATE" > "${MODULE_DIR}/${ENTITY_NAME_LOWER}.controller.ts"

# Generate DTOs
echo -e "${YELLOW}Generating DTOs...${NC}"
replace_placeholders "$CREATE_DTO_TEMPLATE" > "${MODULE_DIR}/dto/create-${ENTITY_NAME_LOWER}.dto.ts"
replace_placeholders "$UPDATE_DTO_TEMPLATE" > "${MODULE_DIR}/dto/update-${ENTITY_NAME_LOWER}.dto.ts"
replace_placeholders "$RESPONSE_DTO_TEMPLATE" > "${MODULE_DIR}/dto/${ENTITY_NAME_LOWER}-response.dto.ts"

# Generate module file
echo -e "${YELLOW}Generating module file...${NC}"
cat > "${MODULE_DIR}/${ENTITY_NAME_LOWER}.module.ts" <<EOF
import { Module } from '@nestjs/common';
import { ${ENTITY_NAME_PASCAL}Controller } from './${ENTITY_NAME_LOWER}.controller';
import { ${ENTITY_NAME_PASCAL}Service } from './${ENTITY_NAME_LOWER}.service';
import { ${ENTITY_NAME_PASCAL}Repository } from './${ENTITY_NAME_LOWER}.repository';

/**
 * ${ENTITY_NAME_PASCAL} Module
 * 
 * Provides ${ENTITY_NAME_LOWER} management functionality:
 * - CRUD operations
 * - RBAC enforcement
 * - Offline sync support
 * - GoBD compliance
 */
@Module({
  controllers: [${ENTITY_NAME_PASCAL}Controller],
  providers: [
    ${ENTITY_NAME_PASCAL}Service,
    ${ENTITY_NAME_PASCAL}Repository,
  ],
  exports: [${ENTITY_NAME_PASCAL}Service],
})
export class ${ENTITY_NAME_PASCAL}Module {}
EOF

# Generate unit tests
echo -e "${YELLOW}Generating unit tests...${NC}"
replace_placeholders "$UNIT_TEST_TEMPLATE" > "${MODULE_DIR}/__tests__/${ENTITY_NAME_LOWER}.service.spec.ts"

# Generate README
echo -e "${YELLOW}Generating module README...${NC}"
cat > "${MODULE_DIR}/README.md" <<EOF
# ${ENTITY_NAME_PASCAL} Module

## Overview
Handles all ${ENTITY_NAME_LOWER}-related operations including CRUD, validation, and RBAC.

## Structure
\`\`\`
${ENTITY_NAME_LOWER}/
├── ${ENTITY_NAME_LOWER}.module.ts       # NestJS module definition
├── ${ENTITY_NAME_LOWER}.controller.ts   # HTTP endpoints
├── ${ENTITY_NAME_LOWER}.service.ts      # Business logic
├── ${ENTITY_NAME_LOWER}.repository.ts   # Data access (CouchDB)
├── dto/                                  # Data transfer objects
│   ├── create-${ENTITY_NAME_LOWER}.dto.ts
│   ├── update-${ENTITY_NAME_LOWER}.dto.ts
│   └── ${ENTITY_NAME_LOWER}-response.dto.ts
├── entities/
│   └── ${ENTITY_NAME_LOWER}.entity.ts   # TypeScript interface
└── __tests__/
    └── ${ENTITY_NAME_LOWER}.service.spec.ts
\`\`\`

## API Endpoints

| Method | Endpoint | Description | RBAC |
|--------|----------|-------------|------|
| GET    | /api/v1/${ENTITY_NAME_PLURAL} | List all ${ENTITY_NAME_PLURAL} | READ |
| GET    | /api/v1/${ENTITY_NAME_PLURAL}/:id | Get single ${ENTITY_NAME_LOWER} | READ |
| POST   | /api/v1/${ENTITY_NAME_PLURAL} | Create ${ENTITY_NAME_LOWER} | CREATE |
| PUT    | /api/v1/${ENTITY_NAME_PLURAL}/:id | Update ${ENTITY_NAME_LOWER} | UPDATE |
| DELETE | /api/v1/${ENTITY_NAME_PLURAL}/:id | Delete ${ENTITY_NAME_LOWER} | DELETE |

## Usage

\`\`\`typescript
// Import the module
import { ${ENTITY_NAME_PASCAL}Module } from './modules/${ENTITY_NAME_LOWER}/${ENTITY_NAME_LOWER}.module';

// In AppModule
@Module({
  imports: [${ENTITY_NAME_PASCAL}Module],
})
export class AppModule {}
\`\`\`

## Testing

\`\`\`bash
# Run unit tests
pnpm test ${ENTITY_NAME_LOWER}

# Run with coverage
pnpm test:cov ${ENTITY_NAME_LOWER}
\`\`\`

## TODO

- [ ] Implement entity-specific validation rules
- [ ] Add custom business logic
- [ ] Define RBAC field-level permissions
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Document API in OpenAPI/Swagger
EOF

echo ""
echo -e "${GREEN}✓ Module generated successfully!${NC}"
echo ""
echo "Generated files:"
echo "  ${MODULE_DIR}/${ENTITY_NAME_LOWER}.module.ts"
echo "  ${MODULE_DIR}/${ENTITY_NAME_LOWER}.controller.ts"
echo "  ${MODULE_DIR}/${ENTITY_NAME_LOWER}.service.ts"
echo "  ${MODULE_DIR}/${ENTITY_NAME_LOWER}.repository.ts"
echo "  ${MODULE_DIR}/entities/${ENTITY_NAME_LOWER}.entity.ts"
echo "  ${MODULE_DIR}/dto/*.dto.ts (3 files)"
echo "  ${MODULE_DIR}/__tests__/${ENTITY_NAME_LOWER}.service.spec.ts"
echo "  ${MODULE_DIR}/README.md"
echo ""
echo "Next steps:"
echo "  1. Customize entity fields in ${ENTITY_NAME_LOWER}.entity.ts"
echo "  2. Add validation rules in DTOs"
echo "  3. Implement business logic in service"
echo "  4. Add module to AppModule imports"
echo "  5. Run tests: pnpm test ${ENTITY_NAME_LOWER}"
echo ""
