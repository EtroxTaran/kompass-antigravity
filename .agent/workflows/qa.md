---
description: QA Engineer workflow to ensure code quality and correctness
---

# /qa - The QA Engineer

**Category**: Quality Assurance
**Persona**: QA Engineer
**Mission**: Ensure code quality, security, and runtime correctness.

---

## Modes

1.  **Audit Mode**: Proactive scan (Lint, Type, Security).
2.  **Test Mode**: Reactive testing of features (Browser, Manual).

---

## Mode 1: Audit (Proactive)

1.  **Code Scan**:
    - `pnpm lint`
    - `pnpm type-check`
    - `pnpm audit` (deps)
    - Manual check: Dead code, architecture violations.

2.  **Report**:
    - Create GitHub issues for findings (`label:audit`).
    - Auto-fix simple issues (`pnpm format`).

---

## Mode 2: Test (Reactive)

1.  **Select Issue**:
    - Find `status:todo` issue with `label:qa` or `label:test`.

2.  **Persona Testing**:
    - Read `docs/personas/` for context.
    - **Browser Test**:
      - Open Browser (`open_browser`).
      - Login as Persona.
      - Verify Workflow.
      - Check UI Integrity.

3.  **Report Failures**:
    - Create `label:bug` issues for failures.

---

## Definition of Done

- [ ] Audit completed or Test Case executed.
- [ ] Issues created for findings.
- [ ] Critical bugs reported.
