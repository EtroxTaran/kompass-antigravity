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

### Step 2: Extract Styling Patterns (NEW)

**When aligning documentation with reference repository, extract:**

1. **Design Tokens** from `src/styles/globals.css`:
   - Color system (OKLCH values)
   - Typography (font families, sizes, weights)
   - Spacing scale (base unit: 4px)
   - Border radius values
   - Shadow levels
   - Sidebar colors

2. **Component Patterns** from `src/components/*.tsx`:
   - Sizes (heights, widths, padding)
   - Variants (all style variations)
   - Spacing (gap values, margins)
   - Structure (component composition)
   - States (hover, focus, active, disabled)
   - Icons (sizes, positioning)

3. **Layout Patterns** from component demos:
   - Grid systems (columns, breakpoints)
   - Container widths
   - Spacing between sections
   - Responsive breakpoints

**See "Styling Guidelines Extraction Methodology" section below for detailed steps.**

### Step 3: Research via GitHub MCP

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

## Styling Guidelines Extraction Methodology

### Step 1: Extract Design Tokens

**Primary Source:** `src/styles/globals.css`

Extract the following from `globals.css`:

- **Color System**: OKLCH color values for all tokens (primary, secondary, accent, destructive, muted, background, foreground, border, card)
- **Typography**: Font families (Plus Jakarta Sans, Source Serif 4, JetBrains Mono), font sizes, weights, line heights
- **Spacing**: Base unit (4px/0.25rem), spacing scale values
- **Border Radius**: All radius values (--radius, --radius-sm, --radius-md, --radius-lg, --radius-xl)
- **Shadows**: All shadow levels (sm, md, lg, xl)
- **Sidebar Colors**: Sidebar-specific color tokens

**Example Extraction:**

```bash
# Fetch globals.css
./scripts/fetch-ui-reference.sh src/styles/globals.css

# Extract color values
grep -E "^\s*--(primary|secondary|accent|destructive)" /tmp/kompass-ui-reference/globals.css

# Extract typography
grep -E "^\s*--font-|font-family:" /tmp/kompass-ui-reference/globals.css
```

### Step 2: Extract Component Patterns

**Primary Sources:** `src/components/*.tsx`

For each component type, extract:

- **Sizes**: Height, width, padding values (e.g., Button: sm=32px, default=40px, lg=48px)
- **Variants**: All variant styles (default, outline, ghost, secondary, destructive, link)
- **Spacing**: Gap values between elements (gap-2, gap-4, gap-6)
- **Structure**: Component composition (CardHeader, CardTitle, CardContent, etc.)
- **States**: Hover, focus, active, disabled states
- **Icons**: Icon sizes and positioning (h-3 w-3, h-4 w-4, h-5 w-5)

**Component Files to Extract:**

- `ButtonVariants.tsx` → Button variants and usage
- `ButtonSizes.tsx` → Button size specifications
- `FormInputsDemo.tsx` → Input patterns, validation states
- `CardDemo.tsx` → Card structure and composition
- `CustomerListDemo.tsx` → Table patterns, row heights, spacing
- `DesktopSidebar.tsx` → Navigation structure, sidebar dimensions
- `CustomerListSkeleton.tsx` → Loading state patterns
- `EmptyCustomerList.tsx` → Empty state patterns
- `EmptySearchResults.tsx` → Search empty state patterns

**Example Extraction:**

```bash
# Fetch component files
./scripts/fetch-ui-reference.sh src/components/ButtonVariants.tsx
./scripts/fetch-ui-reference.sh src/components/FormInputsDemo.tsx

# Extract patterns
grep -E "className=|size=|variant=" /tmp/kompass-ui-reference/ButtonVariants.tsx
grep -E "h-\d+|w-\d+|gap-|p-\d+" /tmp/kompass-ui-reference/FormInputsDemo.tsx
```

### Step 3: Extract Layout Patterns

**Primary Sources:** Component demos and layout files

Extract:

- **Grid Systems**: Column counts, breakpoints, gutter widths
- **Container Widths**: Max-widths, padding
- **Spacing Between Sections**: space-y-4, space-y-6 patterns
- **Responsive Breakpoints**: Mobile, tablet, desktop patterns

**Example Extraction:**

```bash
# Extract grid patterns
grep -E "grid-cols-|md:grid-cols-|lg:grid-cols-" /tmp/kompass-ui-reference/CustomerListDemo.tsx

# Extract spacing patterns
grep -E "space-y-|gap-" /tmp/kompass-ui-reference/CardDemo.tsx
```

### Step 4: Document Reference Sources

**Always document which reference files were used:**

```markdown
**Reference Source:** `EtroxTaran/Kompassuimusterbibliothek/src/components/ButtonVariants.tsx`
```

**Include in documentation:**

- Exact file path from reference repository
- Specific patterns extracted
- Any adaptations made for our stack (React + shadcn/ui + Tailwind)
- Deviations from reference (with justification)

### Step 5: Update Documentation Files

**Update these files with extracted patterns:**

1. **Foundation Docs** (`ui-ux/01-foundation/`):
   - `design-tokens.md` → All color, typography, spacing, shadow values
   - `grid-system.md` → Layout patterns, breakpoints
   - `navigation-patterns.md` → Sidebar structure, navigation patterns
   - `loading-states.md` → Skeleton patterns, loading indicators
   - `error-empty-states.md` → Empty state patterns, error displays

2. **Component Docs** (`ui-ux/02-core-components/`):
   - `buttons.md` → Button sizes, variants, usage
   - `form-inputs.md` → Input patterns, validation states
   - `cards.md` → Card structure, composition
   - `tables-datagrids.md` → Table patterns, row heights
   - All other component docs with reference sources

3. **Style Guide** (`docs/design-system/style-guide.md`):
   - Quick reference for all design tokens
   - Component specifications
   - Common patterns
   - Usage guidelines

### Step 6: Verify Alignment

**Cross-reference extracted values:**

- Verify color values match between `globals.css` and component usage
- Verify spacing values are consistent across components
- Verify typography matches component text sizes
- Ensure all documentation references source files

**Verification Checklist:**

- [ ] All color tokens extracted from `globals.css`
- [ ] All component patterns extracted from component files
- [ ] All documentation files updated with reference sources
- [ ] Style guide created with complete extracted system
- [ ] No hardcoded values in documentation (all reference source files)
- [ ] All adaptations documented with justification

## References

- MCP Tool Usage: `.cursor/rules/mcp-tool-usage-ui-integration.mdc`
- UI/UX Documentation Sync: `.cursor/rules/ui-ux-documentation-sync.mdc`
- UI Components: `.cursor/rules/ui-components.mdc`
- Style Guide: `docs/design-system/style-guide.md`
- UI Implementation Checklist: `docs/guides/ui-implementation-checklist.md`
- UI Implementation Template: `docs/guides/ui-implementation-template.md`
- Helper Scripts: `scripts/README.md`
