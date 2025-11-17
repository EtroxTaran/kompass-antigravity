# GitHub UI Reference Repository Workflow

## Overview

The repository `EtroxTaran/Kompassuimusterbibliothek` is the **canonical and authoritative source** for all UI components, layouts, styling patterns, page structures, UX conventions, and interaction patterns in the KOMPASS project.

**CRITICAL RULES:**

- There is **NO Figma MCP** involved
- There is **NO reference outside of the GitHub UI repo**
- The UI reference **is complete**. If something seems missing, you **MUST ask** for clarification before generating new UI patterns
- Everything you create **MUST mirror, extend, or adapt** patterns from that repo
- **DO NOT** invent new UI patterns unless explicitly requested

## Repository Information

- **Repository:** `EtroxTaran/Kompassuimusterbibliothek`
- **GitHub URL:** https://github.com/EtroxTaran/Kompassuimusterbibliothek
- **Purpose:** Single source of truth for all UI design patterns

## Repository Structure

The reference repository contains:

```
Kompassuimusterbibliothek/
├── README.md          # Repository documentation
├── index.html         # Entry point
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
└── src/               # Source code directory
    ├── components/    # UI components
    ├── pages/         # Page layouts
    └── ...            # Additional directories
```

**Note:** Use GitHub MCP tools or helper scripts (see below) to explore the full repository structure.

## Workflow for Implementing UI Components

### Step 1: Retrieve Task Context

1. Read the Linear issue
2. Understand story + acceptance criteria
3. Understand priority and dependencies
4. Cross-check with project documentation

### Step 2: Research via GitHub MCP

**ALWAYS use GitHub MCP to:**

1. **List directories** in the reference repository

   ```
   Use GitHub MCP to list contents of EtroxTaran/Kompassuimusterbibliothek
   ```

2. **Identify matching components/pages**

   ```
   Search for components matching your needs
   Look for page structures similar to what you need
   ```

3. **Read relevant files**
   ```
   Fetch component source code
   Inspect layout structures
   Review styling conventions (CSS, Tailwind, tokens)
   Understand naming conventions
   Review interaction patterns
   ```

### Step 3: Planning

Write a clear development plan including:

- What will be implemented
- Which reference components/pages will be used
- Required local components
- Required new abstractions
- How the new implementation aligns with the reference repo

### Step 4: Implement

1. **Mirror/Adapt Patterns**: Rebuild using our stack (React + shadcn/ui + Tailwind) matching reference patterns precisely
2. **Use ShadCN**: Generate shadcn/ui components matching reference structure
3. **Follow Local Rules**: Apply project structure, naming conventions, architecture documentation
4. **Document Reference**: Note which reference files were used and any adaptations

### Step 5: Testing

1. Run local environment if needed (browser tab)
2. Confirm UI matches layout patterns from reference repo
3. Write tests
4. Ensure pre-commit hooks pass

### Step 6: Prepare PR

1. Write high-quality PR description
2. Link relevant issues
3. Provide test cases
4. Document which reference components were used
5. Provide summary and screenshots if needed

## Using GitHub MCP to Fetch UI Patterns

### Example: Fetching a Component

```typescript
// Step 1: List repository structure
// Use GitHub MCP: List contents of EtroxTaran/Kompassuimusterbibliothek/src

// Step 2: Find component file
// Use GitHub MCP: Get file contents of EtroxTaran/Kompassuimusterbibliothek/src/components/CustomerForm.tsx

// Step 3: Inspect component
// Read component structure, props, styling, patterns

// Step 4: Implement matching pattern
// Rebuild using shadcn/ui matching reference structure
```

### Example: Fetching a Page Layout

```typescript
// Step 1: Find page in reference
// Use GitHub MCP: Get file contents of EtroxTaran/Kompassuimusterbibliothek/src/pages/CustomerPage.tsx

// Step 2: Inspect layout
// Understand hierarchy, section structure, component placement

// Step 3: Replicate structure
// Match layout hierarchy and component nesting
```

## Rules for Missing UI Elements

If, while implementing a feature, you cannot find:

- A component
- A layout pattern
- A page structure
- An interaction pattern

...in the `EtroxTaran/Kompassuimusterbibliothek`, then:

**STOP IMMEDIATELY AND ASK THE USER.**

Do NOT invent missing components or patterns.
Do NOT attempt to guess the intended design.

## Error Prevention Rules

You must NOT:

- Use Figma MCP (no longer exists)
- Use any design files outside the GitHub reference repo
- Use screenshots
- Use external UI libraries outside our documented stack
- Create new UI patterns unless approved
- Make assumptions about layout not present in the reference repo

## Component Implementation Pattern

### ✅ CORRECT: Reference-Based Implementation

```typescript
// Step 1: Fetch from reference repository
// GitHub MCP: Get CustomerForm.tsx from EtroxTaran/Kompassuimusterbibliothek

// Step 2: Inspect reference component
// - Structure: Form with sections
// - Props: onSubmit, initialValues, validation
// - Styling: Tailwind classes, spacing, colors
// - Patterns: Field grouping, error handling

// Step 3: Rebuild using shadcn/ui
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Step 4: Match reference patterns
// - Same field layout
// - Same validation approach
// - Same styling conventions
// - Same interaction patterns
```

### ❌ WRONG: Inventing Patterns

```typescript
// ❌ WRONG: Creating component without checking reference
function CustomerForm() {
  // Invented structure not in reference repository
  // Should have checked reference first!
}
```

## Page Architecture Pattern

### ✅ CORRECT: Reference-Based Page Structure

```typescript
// Step 1: Fetch page from reference
// GitHub MCP: Get CustomerPage.tsx from reference repository

// Step 2: Understand structure
// - Header section with title and actions
// - Main content area with form/list
// - Sidebar with related information
// - Footer with navigation

// Step 3: Replicate hierarchy
// Match exact section structure and component nesting
```

## Code Conventions from Reference

When implementing from reference:

- **Match component props patterns** as precisely as possible
- **Match structure and behavior** from reference
- **Maintain consistency** with reference style
- **Use our stack** (React + shadcn/ui + Tailwind) but match reference patterns
- **Apply local rules** (ESLint, Prettier, pre-commit hooks)
- **Follow project structure** (file structure, naming conventions, architecture)

## Documentation Requirements

When implementing UI from reference, document:

1. **Reference Source**: Which files from `EtroxTaran/Kompassuimusterbibliothek` were used
2. **Patterns Used**: What patterns were extracted and applied
3. **Adaptations**: Any changes made to match our stack (shadcn/ui, Tailwind)
4. **Deviations**: Any deviations from reference (with justification)

## Helper Scripts

Use these helper scripts to work with the reference repository:

### List Repository Structure

```bash
./scripts/list-ui-reference.sh [path]
```

Lists directory structure of the reference repository. Use optional path parameter to list specific subdirectories.

**Examples:**
```bash
# List root directory
./scripts/list-ui-reference.sh

# List src directory
./scripts/list-ui-reference.sh src

# List components directory
./scripts/list-ui-reference.sh src/components
```

### Search for Components

```bash
./scripts/search-ui-reference.sh <search-term>
```

Searches for files/components in the reference repository by name.

**Examples:**
```bash
# Search for customer-related files
./scripts/search-ui-reference.sh Customer

# Search for form components
./scripts/search-ui-reference.sh form
```

### Fetch Specific File

```bash
./scripts/fetch-ui-reference.sh <file-path> [--open]
```

Fetches specific file from the reference repository and saves to `/tmp/kompass-ui-reference/`. Use `--open` flag to open in your default editor.

**Examples:**
```bash
# Fetch a component file
./scripts/fetch-ui-reference.sh src/components/CustomerListDemo.tsx

# Fetch and open in editor
./scripts/fetch-ui-reference.sh src/pages/CustomerPage.tsx --open
```

**Note:** These scripts require GitHub CLI (`gh`) to be installed and authenticated. Alternatively, use GitHub MCP tools in Cursor.

## Quick Reference

**Repository:** `EtroxTaran/Kompassuimusterbibliothek`  
**GitHub URL:** https://github.com/EtroxTaran/Kompassuimusterbibliothek  
**Tool:** GitHub MCP (always use this to fetch UI patterns)  
**Helper Scripts:** `scripts/list-ui-reference.sh`, `scripts/search-ui-reference.sh`, `scripts/fetch-ui-reference.sh`  
**Workflow:** Fetch → Inspect → Mirror/Adapt → Implement → Document

## Example Implementation

### Customer List Page

A complete example implementation following the reference repository workflow:

**Reference Source:**
- `src/components/CustomerListDemo.tsx` from `EtroxTaran/Kompassuimusterbibliothek`

**Implementation:**
- `apps/frontend/src/pages/CustomerListPage.tsx` - Main page component
- `apps/frontend/src/services/customer.service.ts` - API service
- `apps/frontend/src/pages/__tests__/CustomerListPage.spec.tsx` - Tests

**Documentation:**
- `ui-ux/04-list-views/customer-list.md` - Updated with reference source

**Patterns Applied:**
- Table layout with search functionality
- Loading states with Skeleton components
- Error handling and empty states
- Mobile-responsive design
- RBAC filtering (ADM sees own customers)

## References

- MCP Tool Usage: `.cursor/rules/mcp-tool-usage-ui-integration.mdc`
- UI/UX Documentation Sync: `.cursor/rules/ui-ux-documentation-sync.mdc`
- UI Components: `.cursor/rules/ui-components.mdc`
- UI Implementation Checklist: `docs/guides/ui-implementation-checklist.md`
- UI Implementation Template: `docs/guides/ui-implementation-template.md`
- Helper Scripts: `scripts/README.md`
