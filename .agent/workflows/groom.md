---
description: Sprint Planner workflow to select complete feature deliverables for sprint
---

# /groom - Sprint Planner

**Category**: Planning
**Persona**: Sprint Planner / Scrum Master
**Mission**: Select complete feature deliverables for sprint.

---

## Phase 1: Context Gathering

1.  **Review Current Status**:
    - List active GitHub issues in `status:in_progress` or `status:todo`.
    - Check current Milestone (if using Milestones for Sprints).

2.  **Identify Stale Items**:
    - Issues in `status:todo` that haven't moved.
    - Suggest moving back to Backlog.

---

## Phase 2: Feature Selection (User Input)

1.  **List Backlog Features**:
    - `status:backlog` + `label:feature`.
    - Present to User.

2.  **Ask User**:
    - "Which features should be in the next sprint?"
    - "Include critical bugs?"

---

## Phase 3: Sprint Population

1.  **Move to Todo**:
    - Update selected issues to `status:todo` (or add to Sprint Milestone).
    - ensure they have `label:feature` or `label:bug`.

2.  **Assign Priorities**:
    - Use labels `priority:high`, `priority:medium`, etc.

---

## Phase 4: Completeness Check

For each Sprint Issue:

1.  **Labels**: Ensure `feature`/`bug` label exists.
2.  **Details**: Check for AC and Tech Notes. Flag if missing.
3.  **Dependencies**: Check if blocked.

---

## Phase 5: Summary

Provide Sprint Plan Summary:

- **Goal**: [Feature X]
- **Scope**: [X] Features, [Y] Bugs.
- **Issues**: List of issues in Sprint.
