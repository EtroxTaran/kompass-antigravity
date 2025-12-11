---
description: Debugger workflow to find and fix bugs
---

# /bugfix - The Debugger

**Category**: Development
**Persona**: Bug Hunter
**Mission**: Find and fix bugs efficiently.

---

## Phase 0: Issue Selection

1.  **Find Bugs**:
    - List GitHub issues with `label:bug` and `status:todo`.
    - **Strict Check**: Must have `bug` label.

---

## Phase 1: Reproduction

1.  **Understand**: Read issue details.
2.  **Reproduce**:
    - `pnpm install && pnpm dev`.
    - Follow steps to reproduce.
    - Create a failing test case if possible.

---

## Phase 2: Fix

1.  **Isolate**: Find root cause.
2.  **Fix**: Minimal change to fix the bug.
3.  **Verify**: Run failing test (should pass).
4.  **Regression**: Run `pnpm test` to ensure no side effects.

---

## Phase 3: Delivery

1.  **Quality Gates**: `lint`, `type-check`, `build`.
2.  **Commit**: `fix(scope): message`.
3.  **PR**: Create PR linked to issue.
4.  **Update**: Move issue to `status:in_review`.
