# UI Implementation Template

Use this template when documenting UI implementations from the GitHub UI reference repository.

## Implementation Summary

**Component/Page:** [Name of component or page implemented]  
**Linear Issue:** [KOM-XXX]  
**Reference Repository:** `EtroxTaran/Kompassuimusterbibliothek`

## Reference Source

### Files Used from Reference Repository

List all files from the reference repository that were used:

- `src/components/[ComponentName].tsx` - [Brief description of what was extracted]
- `src/pages/[PageName].tsx` - [Brief description of layout patterns]
- `src/[other-files]` - [Additional files if any]

### Patterns Extracted

- **Layout Structure:** [Describe layout hierarchy, sections, component nesting]
- **Styling Conventions:** [Tailwind classes, spacing, colors used]
- **Component Props:** [Props patterns, validation, default values]
- **Interaction Patterns:** [User interactions, state management, event handling]

## Implementation Details

### Components Created

- `apps/frontend/src/features/[feature]/components/[ComponentName].tsx`
- `apps/frontend/src/features/[feature]/pages/[PageName].tsx`
- [Additional components if any]

### shadcn/ui Components Used

- `Button` - [Usage description]
- `Table` - [Usage description]
- `Card` - [Usage description]
- [Additional components]

### Adaptations Made

Describe any changes made to match our stack or requirements:

- **Stack Adaptation:** [How reference patterns were adapted for React + shadcn/ui + Tailwind]
- **Project Structure:** [How components were organized in our feature-based structure]
- **RBAC Integration:** [How RBAC filtering was added if applicable]
- **Offline Support:** [How offline-first patterns were integrated if applicable]

### Deviations from Reference

List any deviations from the reference repository (with justification):

- **Deviation 1:** [Description] - **Justification:** [Why this deviation was necessary]
- **Deviation 2:** [Description] - **Justification:** [Why this deviation was necessary]

## Testing

### Tests Added

- `[ComponentName].spec.tsx` - Unit tests for [description]
- [Additional test files]

### Test Coverage

- Component rendering
- User interactions
- Edge cases
- Accessibility (ARIA labels, keyboard navigation)
- Responsive behavior

## Verification

- [ ] Code formatted (`pnpm format:check`)
- [ ] Linting passed (`pnpm lint`)
- [ ] Type checking passed (`pnpm type-check`)
- [ ] All tests passing (`pnpm test:unit`)
- [ ] Visual comparison with reference patterns
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Mobile responsive verified

## Screenshots (if applicable)

[Add screenshots comparing implementation with reference patterns]

## Related Documentation

- UI/UX Documentation: `ui-ux/[category]/[component-name].md`
- GitHub UI Reference: `docs/design-system/github-ui-reference.md`
- Implementation Checklist: `docs/guides/ui-implementation-checklist.md`

