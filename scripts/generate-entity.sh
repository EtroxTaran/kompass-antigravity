#!/bin/bash

###############################################################################
# Generate Complete Entity (Backend + Frontend) for KOMPASS
#
# Usage: ./scripts/generate-entity.sh <entity-name>
# Example: ./scripts/generate-entity.sh customer
#
# Generates:
# - Backend module (controller, service, repository, DTOs, tests)
# - Frontend feature (components, hooks, store, service, types)
# - Shared entity type definition
#
# This is a convenience script that calls both generate-module.sh and
# generate-feature.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Entity name required${NC}"
    echo "Usage: ./scripts/generate-entity.sh <entity-name>"
    echo "Example: ./scripts/generate-entity.sh customer"
    exit 1
fi

ENTITY_NAME="$1"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║           KOMPASS Entity Generator                           ║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Generating complete CRUD for: ${GREEN}${ENTITY_NAME}${NC}"
echo ""

# Step 1: Generate shared type
echo -e "${YELLOW}Step 1/3: Generating shared type definition...${NC}"
ENTITY_NAME_LOWER=$(echo "$ENTITY_NAME" | tr '[:upper:]' '[:lower:]')
ENTITY_NAME_PASCAL=$(echo "$ENTITY_NAME" | sed 's/\b\(.\)/\u\1/g')

SHARED_DIR="packages/shared/src/types/entities"
mkdir -p "$SHARED_DIR"

# Generate shared entity from template
ENTITY_TEMPLATE=$(cat templates/backend/entity.template.ts)
echo "$ENTITY_TEMPLATE" | sed \
    -e "s/{{ENTITY_NAME}}/${ENTITY_NAME_PASCAL}/g" \
    -e "s/{{ENTITY_NAME_LOWER}}/${ENTITY_NAME_LOWER}/g" \
    -e "s/{{ENTITY_DESCRIPTION}}/Represents a ${ENTITY_NAME_LOWER} in the KOMPASS system/g" \
    > "${SHARED_DIR}/${ENTITY_NAME_LOWER}.ts"

echo -e "${GREEN}  ✓ Shared type created: ${SHARED_DIR}/${ENTITY_NAME_LOWER}.ts${NC}"
echo ""

# Step 2: Generate backend module
echo -e "${YELLOW}Step 2/3: Generating backend module...${NC}"
./scripts/generate-module.sh "$ENTITY_NAME"
echo ""

# Step 3: Generate frontend feature
echo -e "${YELLOW}Step 3/3: Generating frontend feature...${NC}"
./scripts/generate-feature.sh "$ENTITY_NAME"
echo ""

# Summary
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                   Generation Complete!                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✓ Complete CRUD scaffolding generated for ${ENTITY_NAME_PASCAL}${NC}"
echo ""
echo "Generated:"
echo "  📦 Shared:   packages/shared/src/types/entities/${ENTITY_NAME_LOWER}.ts"
echo "  🔧 Backend:  apps/backend/src/modules/${ENTITY_NAME_LOWER}/ (8 files)"
echo "  🎨 Frontend: apps/frontend/src/features/${ENTITY_NAME_LOWER}/ (9 files)"
echo ""
echo "Next steps:"
echo "  1. Customize entity fields in shared type"
echo "  2. Add validation rules in backend DTOs"
echo "  3. Implement business logic in service"
echo "  4. Design UI with shadcn/ui components"
echo "  5. Add module to AppModule (backend)"
echo "  6. Add slice to Redux store (frontend)"
echo "  7. Create routes in app router"
echo "  8. Write tests"
echo ""
echo "Quick start:"
echo "  ${YELLOW}cd apps/backend && pnpm test ${ENTITY_NAME_LOWER}${NC}"
echo "  ${YELLOW}cd apps/frontend && pnpm test ${ENTITY_NAME_LOWER}${NC}"
echo ""
