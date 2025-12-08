# UI Implementation Checklist

This checklist ensures all UI implementations follow the GitHub UI reference repository workflow and project standards.

## Pre-Implementation

- [ ] **Read Linear Issue**
  - [ ] Understand requirements and acceptance criteria
  - [ ] Identify UI components/pages needed
  - [ ] Note any specific design requirements

- [ ] **Check Local UI Reference**
  - [ ] Explore directory structure: `ui-ux/Kompassuimusterbibliothek`
  - [ ] Search for matching components (use file search tools)
  - [ ] Identify reference files that match requirements
  - [ ] If component not found: **STOP and ask user for clarification**

- [ ] **Inspect Reference Files**
  - [ ] Open relevant reference files from `ui-ux/Kompassuimusterbibliothek/src/...`
  - [ ] Inspect component structure, props, styling patterns
  - [ ] Understand layout hierarchy and component nesting
  - [ ] Note styling conventions (Tailwind classes, spacing, colors)

## Implementation

- [ ] **Plan Implementation**
  - [ ] Document which reference files will be used
  - [ ] List required shadcn/ui components
  - [ ] Note any adaptations needed for our stack
  - [ ] Plan component structure matching reference

- [ ] **Generate shadcn/ui Components**
  - [ ] Install required shadcn/ui components: `pnpm dlx shadcn-ui@latest add <component>`
  - [ ] Match component structure from reference repository
  - [ ] Apply styling conventions from reference

- [ ] **Implement Component/Page**
  - [ ] Match layout structure from reference
  - [ ] Use shadcn/ui components exclusively
  - [ ] Follow project architecture (feature-based structure)
  - [ ] Apply RBAC filtering if needed
  - [ ] Add loading states, error handling, empty states
  - [ ] Ensure mobile-responsive design
  - [ ] Verify WCAG 2.1 AA compliance

- [ ] **Write Tests**
  - [ ] Unit tests for components (colocated with source)
  - [ ] Test user interactions and edge cases
  - [ ] Test accessibility (ARIA labels, keyboard navigation)
  - [ ] Test responsive behavior

## Documentation

- [ ] **Update UI/UX Documentation**
  - [ ] Update relevant file in `ui-ux/` directory
  - [ ] Document reference source (which files from reference repo)
  - [ ] Include exact specifications from reference
  - [ ] Note adaptations and deviations (with justification)

- [ ] **Document Implementation**
  - [ ] Use `docs/guides/ui-implementation-template.md` for PR description
  - [ ] List reference files used
  - [ ] Document patterns extracted and applied
  - [ ] Note any deviations from reference

## Verification

- [ ] **Code Quality**
  - [ ] Run `pnpm format:check` - all files properly formatted
  - [ ] Run `pnpm lint` - no linting errors
  - [ ] Run `pnpm type-check` - no type errors
  - [ ] Run `pnpm test:unit` - all tests passing

- [ ] **UI Verification**
  - [ ] Visual comparison with reference repository patterns
  - [ ] Test in browser (desktop and mobile)
  - [ ] Verify accessibility (keyboard navigation, screen reader)
  - [ ] Check responsive breakpoints

- [ ] **Documentation Verification**
  - [ ] All reference sources documented
  - [ ] UI/UX documentation updated
  - [ ] PR description complete with reference information

## Tools

Use your standard file exploration tools:

- **List files:** `ls -R ui-ux/Kompassuimusterbibliothek`
- **Read content:** `view_file` or `cat`
- **Global search:** `grep` or `grep_search`

## References

- Local UI Reference: `docs/design-system/ui-reference.md`
- UI Implementation Template: `docs/guides/ui-implementation-template.md`
- UI Components Rule: `.cursor/rules/ui-components.mdc`
- UI/UX Documentation Sync: `.cursor/rules/ui-ux-documentation-sync.mdc`
