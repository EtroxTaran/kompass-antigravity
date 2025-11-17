UI_REFERENCE_REPOSITORY = "EtroxTaran/Kompassuimusterbibliothek"

# Example:

# UI_REFERENCE_REPOSITORY = "my-org/ui-design-showcase"

---

# === PURPOSE ===

You are the Cursor Coding Agent.
Your task is to perform a **full UI consistency audit** between:

1. **The UI Design Showcase repo**  
   (EtroxTaran/Kompassuimusterbibliothek, fetched entirely via GitHub MCP)

2. **The current application codebase**  
   (the local project in Cursor)

Your job is to:

- Analyze every UI component
- Analyze every UX element
- Analyze every page layout
- Analyze naming conventions
- Analyze tokens, spacing, color usage
- Analyze all shadcn/ui usage
- Analyze structure and interaction patterns
- Confirm perfect alignment with the UI design showcase
- Fix any inconsistencies or missing elements

This is a **deep, multi-level, full-scan audit + remediation task**.

There is **no Figma MCP**.  
There is **only the GitHub MCP UI reference repo**.  
This is the single, authoritative source of UI truth.

---

# === AUDIT SCOPE ===

You must examine **all UI touchpoints**, including but not limited to:

## 1. Components

- Buttons
- Inputs
- Forms
- Tabs
- Cards
- Tables
- Dropdowns
- Navigation
- Headers + Subheaders
- Modals
- Toasts
- Empty State components
- Loading states
- Icons / icon usage
- All shadcn/ui primitives and wrappers

## 2. Layout & Structure

- Grid layouts
- Page shells
- Sidebar and top navigation
- Section organization
- Margins/padding
- Responsive breakpoints
- Page-level wrappers
- Consistent use of design tokens (spacing, radii, shadows)

## 3. Styling & Tokens

- Colors
- Typography
- Spacing
- Shadows
- Border radii
- Animations/transitions
- Tailwind utility usage
- shadcn/ui theme extensions

## 4. Pages

Every page in the local app must be matched to its corresponding page in the UI reference repo.  
Examples:

- Dashboard
- Lists
- Details pages
- Edit forms
- Wizards / multi-step flows
- Settings pages
- Authentication pages
- Landing pages
- Mobile breakpoints

If a local page is missing a canonical reference, **ask for clarification**.

## 5. Interactions

- Button/link behavior
- Hover/focus/active states
- Form validation
- Component props
- Navigation flows
- Routing
- Conditional render patterns
- Modals/dialog open/close logic

---

# === AUDIT WORKFLOW (MANDATORY) ===

You must follow this workflow:

## STEP 1 — Fetch the UI Reference Repo Structure

Using GitHub MCP:

- List all files and folders in EtroxTaran/Kompassuimusterbibliothek
- Identify:
  - Components directory
  - Layout directory
  - Pages directory
  - Utilities/tokens
- Build a mental model of the architecture

## STEP 2 — Extract UI Patterns from Reference Repo

Using GitHub MCP:

- Read all core UI components
- Read layout components
- Read the page-level components
- Extract naming conventions
- Extract structure patterns
- Extract consistent prop usage
- Extract styling + utility conventions

You must create a complete internal catalogue of:

- Components
- Props
- Patterns
- Tokens
- Layouts
- Pages

This becomes your comparison baseline.

## STEP 3 — Scan the Local Application

Scan the entire local UI codebase:

- Components
- Pages
- Layouts
- Routes
- Styling
- Hooks
- Utilities
- Any shadcn/ui overrides

Identify:

- Missing components
- Deviations in structure
- Deviations in naming
- Deviations in spacing, tokens, styling
- Incorrect prop usage
- Missing UI patterns
- Wrong layout alignment
- Any inconsistency with the reference UI repo

## STEP 4 — Produce a Full Gap Analysis

For each UI element:

- List differences
- Categorize issues:
  - Missing components
  - Styling mismatches
  - Layout differences
  - Token inconsistencies
  - Wrong props
  - Incorrect states
  - Missing pages or flows
- Determine required fixes

## STEP 5 — Apply Fixes

After the gap analysis is complete, fix issues systematically:

- Create missing components
- Correct props
- Correct naming
- Rebuild layouts
- Update styling/tokens
- Ensure responsive behavior matches reference
- Normalize interaction patterns
- Replace custom code with canonical patterns if needed

## STEP 6 — Refactor for Consistency

Ensure:

- DRYness
- Component reuse
- Clean architecture
- Adherence to local coding guidelines
- Correct folder structure
- Type safety

## STEP 7 — Testing & Validation

- Run components in browser tab if needed
- Validate interaction patterns
- Ensure styling matches reference visually and structurally
- Add or update tests
- Ensure pre-commit hooks & CI quality gates pass

---

# === SPECIAL RULES ===

## RULE A — No Guessing

If the reference repo has a component or pattern:
→ Use it, replicate it, or adapt it exactly.

If something is _not_ present:
→ Ask the user for clarification before inventing.

## RULE B — No Creative Freedom

- Do not improvise new UI elements
- Do not import new libraries
- Only use shadcn/ui, Tailwind, and our architecture

## RULE C — Never modify the reference repo

Use it **read-only** via GitHub MCP.

## RULE D — Output must be complete

When implementing fixes, always:

- Update components
- Update pages
- Update styles
- Update tests
- Apply all quality gates

---

# === SUMMARY ===

You are performing a **full UI audit** of the entire codebase.  
You must use the GitHub MCP UI reference repo as the **one and only** design authority.  
Your responsibilities:

- Scan the entire UI
- Compare against canonical reference
- Identify inconsistencies
- Fix all deviations
- Ensure perfect alignment
- Ask if anything seems missing

Execute with precision and completeness.
