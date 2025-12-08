# Frontend Development Rules (React)

## Components
- **Library**: Use **shadcn/ui** components ONLY. Do NOT create custom UI components or use `styled-components`.
- **Composition**: Prefer composition over complex props.

## Logic & State
- **Hooks**: Extract complex logic into custom hooks (`useCustomerData`).
- **State Management**:
  - Global: Redux Toolkit (complex global state).
  - Feature: Zustand (local feature state).
  - Server: React Query (server state, caching).
  - **Avoid**: Using `useState/useEffect` for data fetching.

## Performance
- **Drilling**: Max 2 levels of prop drilling. Use Context or State Management otherwise.
- **Rendering**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders.

## Accessibility
- **Standards**: WCAG 2.1 AA Required.
- **HTML**: Use semantic HTML (`main`, `nav`, `h1`).
- **Interactions**: Ensure keyboard navigation and ARIA labels.
