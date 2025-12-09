# UI Reference Workflow

## Overview

The directory `ui-ux/Kompassuimusterbibliothek` is the **canonical and authoritative source** for all UI components, layouts, styling patterns, page structures, UX conventions, and interaction patterns in the KOMPASS project.

**CRITICAL RULES:**

- We use the **local checkout** at `ui-ux/Kompassuimusterbibliothek` as our reference.
- The UI reference **is complete**. If something seems missing, you **MUST ask** for clarification before generating new UI patterns.
- Everything you create **MUST mirror, extend, or adapt** patterns from that directory.
- **DO NOT** invent new UI patterns unless explicitly requested.

## Reference Location

- **Local Path:** `ui-ux/Kompassuimusterbibliothek` (relative to workspace root)
- **Purpose:** Single source of truth for all UI design patterns.

## Directory Structure

The reference directory contains:

```
ui-ux/Kompassuimusterbibliothek/
├── README.md          # Repository documentation
├── index.html         # Entry point
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
└── src/               # Source code directory
    ├── components/    # UI components
    ├── pages/         # Page layouts
    └── ...            # Additional directories
```

## Workflow for Implementing UI Components

### Step 1: Retrieve Task Context

1. Read the Linear issue.
2. Understand story + acceptance criteria.
3. Understand priority and dependencies.
4. Cross-check with project documentation.

### Step 2: Extract Styling Patterns

**When aligning documentation with the reference, extract:**

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

### Step 3: Research via File Exploration

**Use your file exploration tools (e.g., `list_dir`, `view_file`) to:**

1. **List directories** in the reference folder:

   ```bash
   ls -R ui-ux/Kompassuimusterbibliothek/src
   # or use list_dir tool
   ```

2. **Identify matching components/pages:**
   - Search for components matching your needs.
   - Look for page structures similar to what you need.

3. **Read relevant files:**
   - Read component source code.
   - Inspect layout structures.
   - Review styling conventions (CSS, Tailwind, tokens).
   - Understand naming conventions.
   - Review interaction patterns.

### Step 4: Planning

Write a clear development plan including:

- What will be implemented.
- Which reference components/pages will be used.
- Required local components.
- Required new abstractions.
- How the new implementation aligns with the reference patterns.

### Step 5: Implement

1. **Mirror/Adapt Patterns**: Rebuild using our stack (React + shadcn/ui + Tailwind) matching reference patterns precisely.
2. **Use ShadCN**: Generate shadcn/ui components matching reference structure.
3. **Follow Local Rules**: Apply project structure, naming conventions, and architecture documentation.
4. **Document Reference**: Note which reference files were used and any adaptations.

### Step 6: Testing

1. Run local environment if needed.
2. Confirm UI matches layout patterns from reference.
3. Write tests.
4. Ensure pre-commit hooks pass.

### Step 7: Prepare PR

1. Write high-quality PR description.
2. Link relevant issues.
3. Provide test cases.
4. Document which reference components were used.
5. Provide summary and screenshots if needed.

## Rules for Missing UI Elements

If, while implementing a feature, you cannot find:

- A component
- A layout pattern
- A page structure
- An interaction pattern

...in `ui-ux/Kompassuimusterbibliothek`, then:

**STOP IMMEDIATELY AND ASK THE USER.**

Do NOT invent missing components or patterns.
Do NOT attempt to guess the intended design.

## Error Prevention Rules

You must NOT:

- Use generic internet searches for UI patterns.
- Use screenshots as primary reference.
- Use external UI libraries outside our documented stack.
- Create new UI patterns unless approved.
- Make assumptions about layout not present in the reference.

## Documentation Requirements

When implementing UI from reference, document:

1. **Reference Source**: Which files from `ui-ux/Kompassuimusterbibliothek` were used.
2. **Patterns Used**: What patterns were extracted and applied.
3. **Adaptations**: Any changes made to match our stack (shadcn/ui, Tailwind).
4. **Deviations**: Any deviations from reference (with justification).

## Quick Reference

**Path:** `ui-ux/Kompassuimusterbibliothek`
**Tools:** `list_dir`, `view_file` (standard tools)
**Workflow:** Explore → Inspect → Mirror/Adapt → Implement → Document
