#!/bin/bash

###############################################################################
# Generate Frontend Feature Script for KOMPASS
#
# Usage: ./scripts/generate-feature.sh <feature-name>
# Example: ./scripts/generate-feature.sh customer
#
# Generates:
# - Feature directory structure
# - Components (using shadcn/ui)
# - Custom hooks (with offline sync)
# - Redux Toolkit slice
# - Zustand store
# - API service
# - Types
# - Tests
#
# Following: Feature-based architecture and offline-first patterns
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Feature name required${NC}"
    echo "Usage: ./scripts/generate-feature.sh <feature-name>"
    echo "Example: ./scripts/generate-feature.sh customer"
    exit 1
fi

FEATURE_NAME_LOWER=$(echo "$1" | tr '[:upper:]' '[:lower:]')
FEATURE_NAME_PASCAL=$(echo "$1" | sed 's/\b\(.\)/\u\1/g')
FEATURE_NAME_PLURAL="${FEATURE_NAME_LOWER}s"
FEATURE_NAME_PLURAL_PASCAL="${FEATURE_NAME_PASCAL}s"

echo -e "${GREEN}Generating frontend feature for: ${FEATURE_NAME_PASCAL}${NC}"
echo "Feature: ${FEATURE_NAME_PASCAL}"
echo "Lowercase: ${FEATURE_NAME_LOWER}"
echo "Plural: ${FEATURE_NAME_PLURAL}"
echo ""

# Base directory
FEATURE_DIR="apps/frontend/src/features/${FEATURE_NAME_LOWER}"

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "${FEATURE_DIR}/components"
mkdir -p "${FEATURE_DIR}/components/__tests__"
mkdir -p "${FEATURE_DIR}/hooks"
mkdir -p "${FEATURE_DIR}/services"
mkdir -p "${FEATURE_DIR}/store"
mkdir -p "${FEATURE_DIR}/types"

# Read templates
COMPONENT_TEMPLATE=$(cat templates/frontend/component.template.tsx)
HOOK_TEMPLATE=$(cat templates/frontend/hook.template.ts)
STORE_SLICE_TEMPLATE=$(cat templates/frontend/store-slice.template.ts)
ZUSTAND_STORE_TEMPLATE=$(cat templates/frontend/zustand-store.template.ts)
SERVICE_TEMPLATE=$(cat templates/frontend/service.template.ts)

# Replace placeholders
replace_placeholders() {
    echo "$1" | sed \
        -e "s/{{COMPONENT_NAME}}/${FEATURE_NAME_PASCAL}/g" \
        -e "s/{{ENTITY_NAME}}/${FEATURE_NAME_PASCAL}/g" \
        -e "s/{{ENTITY_NAME_LOWER}}/${FEATURE_NAME_LOWER}/g" \
        -e "s/{{ENTITY_NAME_PLURAL}}/${FEATURE_NAME_PLURAL_PASCAL}/g" \
        -e "s/{{ENTITY_NAME_PLURAL_LOWER}}/${FEATURE_NAME_PLURAL}/g" \
        -e "s/{{FEATURE_NAME}}/${FEATURE_NAME_PASCAL}/g" \
        -e "s/{{FEATURE_NAME_LOWER}}/${FEATURE_NAME_LOWER}/g" \
        -e "s/{{DESCRIPTION}}/Manages ${FEATURE_NAME_LOWER} data and operations/g"
}

# Generate components
echo -e "${YELLOW}Generating components...${NC}"
replace_placeholders "$COMPONENT_TEMPLATE" > "${FEATURE_DIR}/components/${FEATURE_NAME_PASCAL}Card.tsx"

# Generate List component
cat > "${FEATURE_DIR}/components/${FEATURE_NAME_PASCAL}List.tsx" <<EOF
import { use${FEATURE_NAME_PASCAL}List } from '../hooks/use${FEATURE_NAME_PASCAL}';
import { ${FEATURE_NAME_PASCAL}Card } from './${FEATURE_NAME_PASCAL}Card';
import { Skeleton } from '@/components/ui/skeleton';

export function ${FEATURE_NAME_PASCAL}List(): JSX.Element {
  const { data: ${FEATURE_NAME_PLURAL}, isLoading, error } = use${FEATURE_NAME_PASCAL}List();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        Error loading ${FEATURE_NAME_PLURAL}: {error.message}
      </div>
    );
  }

  if (!${FEATURE_NAME_PLURAL} || ${FEATURE_NAME_PLURAL}.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No ${FEATURE_NAME_PLURAL} found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {${FEATURE_NAME_PLURAL}.map((${FEATURE_NAME_LOWER}) => (
        <${FEATURE_NAME_PASCAL}Card key={${FEATURE_NAME_LOWER}._id} id={${FEATURE_NAME_LOWER}._id} />
      ))}
    </div>
  );
}
EOF

# Generate hooks
echo -e "${YELLOW}Generating hooks...${NC}"
replace_placeholders "$HOOK_TEMPLATE" > "${FEATURE_DIR}/hooks/use${FEATURE_NAME_PASCAL}.ts"

# Generate store slice (Redux Toolkit)
echo -e "${YELLOW}Generating Redux Toolkit slice...${NC}"
replace_placeholders "$STORE_SLICE_TEMPLATE" > "${FEATURE_DIR}/store/${FEATURE_NAME_LOWER}Slice.ts"

# Generate Zustand store (local state)
echo -e "${YELLOW}Generating Zustand store...${NC}"
replace_placeholders "$ZUSTAND_STORE_TEMPLATE" > "${FEATURE_DIR}/store/${FEATURE_NAME_LOWER}Store.ts"

# Generate API service
echo -e "${YELLOW}Generating API service...${NC}"
replace_placeholders "$SERVICE_TEMPLATE" > "${FEATURE_DIR}/services/${FEATURE_NAME_LOWER}.service.ts"

# Generate types
echo -e "${YELLOW}Generating types...${NC}"
cat > "${FEATURE_DIR}/types/${FEATURE_NAME_LOWER}.types.ts" <<EOF
/**
 * Frontend types for ${FEATURE_NAME_PASCAL}
 * 
 * Re-exports shared types and adds frontend-specific types
 */

export type {
  ${FEATURE_NAME_PASCAL},
} from '@kompass/shared';

/**
 * DTO for creating a ${FEATURE_NAME_LOWER}
 */
export interface Create${FEATURE_NAME_PASCAL}Dto {
  // TODO: Add your fields
  name: string;
  description?: string;
}

/**
 * DTO for updating a ${FEATURE_NAME_LOWER}
 */
export interface Update${FEATURE_NAME_PASCAL}Dto extends Partial<Create${FEATURE_NAME_PASCAL}Dto> {
  _rev?: string; // For optimistic locking
}

/**
 * Sync status for offline-first
 */
export interface ${FEATURE_NAME_PASCAL}SyncStatus {
  queued: boolean;
  conflicts: number;
  lastSynced: Date | null;
}
EOF

# Generate index file
cat > "${FEATURE_DIR}/index.ts" <<EOF
/**
 * ${FEATURE_NAME_PASCAL} Feature Module
 * 
 * Exports all public components, hooks, and types
 */

// Components
export { ${FEATURE_NAME_PASCAL}List } from './components/${FEATURE_NAME_PASCAL}List';
export { ${FEATURE_NAME_PASCAL}Card } from './components/${FEATURE_NAME_PASCAL}Card';

// Hooks
export { 
  use${FEATURE_NAME_PASCAL},
  use${FEATURE_NAME_PASCAL}List,
  useCreate${FEATURE_NAME_PASCAL},
  useUpdate${FEATURE_NAME_PASCAL},
  useDelete${FEATURE_NAME_PASCAL},
} from './hooks/use${FEATURE_NAME_PASCAL}';

// Store
export {
  ${FEATURE_NAME_LOWER}Slice,
  set${FEATURE_NAME_PLURAL_PASCAL},
  add${FEATURE_NAME_PASCAL},
  update${FEATURE_NAME_PASCAL},
  remove${FEATURE_NAME_PASCAL},
  select${FEATURE_NAME_PASCAL},
} from './store/${FEATURE_NAME_LOWER}Slice';

export { use${FEATURE_NAME_PASCAL}Store } from './store/${FEATURE_NAME_LOWER}Store';

// Types
export type {
  ${FEATURE_NAME_PASCAL},
  Create${FEATURE_NAME_PASCAL}Dto,
  Update${FEATURE_NAME_PASCAL}Dto,
} from './types/${FEATURE_NAME_LOWER}.types';
EOF

# Generate README
cat > "${FEATURE_DIR}/README.md" <<EOF
# ${FEATURE_NAME_PASCAL} Feature

## Overview
Frontend feature for ${FEATURE_NAME_LOWER} management with offline-first support.

## Structure
\`\`\`
${FEATURE_NAME_LOWER}/
├── components/
│   ├── ${FEATURE_NAME_PASCAL}Card.tsx       # Card component (shadcn/ui)
│   ├── ${FEATURE_NAME_PASCAL}List.tsx       # List component
│   └── __tests__/
├── hooks/
│   └── use${FEATURE_NAME_PASCAL}.ts         # React Query hooks
├── services/
│   └── ${FEATURE_NAME_LOWER}.service.ts     # API + PouchDB service
├── store/
│   ├── ${FEATURE_NAME_LOWER}Slice.ts        # Redux Toolkit slice
│   └── ${FEATURE_NAME_LOWER}Store.ts        # Zustand local store
├── types/
│   └── ${FEATURE_NAME_LOWER}.types.ts       # TypeScript types
└── index.ts                                  # Public exports
\`\`\`

## Usage

\`\`\`tsx
import { ${FEATURE_NAME_PASCAL}List, use${FEATURE_NAME_PASCAL} } from '@/features/${FEATURE_NAME_LOWER}';

function MyComponent() {
  return <${FEATURE_NAME_PASCAL}List />;
}

function AnotherComponent() {
  const { data, isLoading } = use${FEATURE_NAME_PASCAL}('${FEATURE_NAME_LOWER}-id');
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{data.name}</div>;
}
\`\`\`

## Offline Support

This feature implements offline-first patterns:
- Data cached in PouchDB
- Automatic sync when online
- Conflict detection and resolution
- Queue for offline changes

## Testing

\`\`\`bash
# Run component tests
pnpm test ${FEATURE_NAME_LOWER}
\`\`\`

## TODO

- [ ] Customize components with actual fields
- [ ] Add form component (react-hook-form + shadcn)
- [ ] Implement business logic in hooks
- [ ] Add component tests
- [ ] Configure RBAC field filtering
EOF

echo ""
echo -e "${GREEN}✓ Feature generated successfully!${NC}"
echo ""
echo "Generated files:"
echo "  ${FEATURE_DIR}/components/${FEATURE_NAME_PASCAL}Card.tsx"
echo "  ${FEATURE_DIR}/components/${FEATURE_NAME_PASCAL}List.tsx"
echo "  ${FEATURE_DIR}/hooks/use${FEATURE_NAME_PASCAL}.ts"
echo "  ${FEATURE_DIR}/services/${FEATURE_NAME_LOWER}.service.ts"
echo "  ${FEATURE_DIR}/store/${FEATURE_NAME_LOWER}Slice.ts"
echo "  ${FEATURE_DIR}/store/${FEATURE_NAME_LOWER}Store.ts"
echo "  ${FEATURE_DIR}/types/${FEATURE_NAME_LOWER}.types.ts"
echo "  ${FEATURE_DIR}/index.ts"
echo "  ${FEATURE_DIR}/README.md"
echo ""
echo "Next steps:"
echo "  1. Install shadcn/ui components: pnpm dlx shadcn-ui@latest add card button"
echo "  2. Customize components with your fields"
echo "  3. Add to Redux root reducer"
echo "  4. Create route in app router"
echo ""

