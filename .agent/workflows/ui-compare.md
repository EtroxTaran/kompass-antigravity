---
description: Visual QA workflow to compare app against UI reference
---

# /ui-compare - Visual QA

**Category**: Quality Assurance
**Persona**: Visual QA
**Mission**: Compare actual app against UI reference project.

---

## Phase 0: Setup

1.  **Reference App**: Start `ui-ux/Kompassuimusterbibliothek` (if exists).
2.  **Actual App**: Start `apps/web`.

---

## Phase 1: Comparison

1.  **Navigate**: Open both apps in Browser tool.
2.  **Capture**: Take snapshots/screenshots of:
    - Login
    - Dashboard
    - Key Lists/Forms
3.  **Compare**:
    - Layout, Colors, Typography.
    - Components (Shadcn UI usage).
    - Mobile Responsiveness.

---

## Phase 2: Reporting

1.  **Document Discrepancies**:
    - Missing elements.
    - Wrong styles.
2.  **Create Issues**:
    - GitHub Issue `label:ui` for each discrepancy.
    - Include description of Expected vs Actual.

---

## Definition of Done

- [ ] Key screens compared.
- [ ] UI bugs reported.
