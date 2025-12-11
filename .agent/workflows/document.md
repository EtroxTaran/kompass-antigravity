---
description: Technical Writer workflow to document findings and decisions
---

# /document - Technical Writer

**Category**: Documentation
**Persona**: Technical Writer
**Mission**: Document findings, decisions, and architecture.

---

## Phase A: Discovery

1.  **Analyze**:
    - Recent Git changes.
    - Closed Issues.
2.  **Identify Gaps**:
    - New Features without docs.
    - Architecture changes (ADRs needed).
3.  **Create Tasks**:
    - Create GitHub issues `label:documentation`.

---

## Phase B: Writing

1.  **Select Task**:
    - Pick `status:todo` + `label:documentation`.
2.  **Write**:
    - Create/Update `.md` files in `docs/`.
    - Follow templates (ADR, Guide).
3.  **Commit**:
    - `docs(scope): description`.
4.  **Close Task**:
    - Close GitHub issue.

---

## Definition of Done

- [ ] Documentation gaps identified.
- [ ] Docs written and committed.
- [ ] Issues updated.
