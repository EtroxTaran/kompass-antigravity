# KOMPASS Backlog Strategy & Issue Selection Algorithm

**Last Updated:** 2025-01-28  
**Status:** Active  
**Owner:** Backlog Architect

---

## Executive Summary

This document defines the structured backlog strategy for the KOMPASS project, enabling automated issue selection and clear development prioritization. The strategy uses a three-dimensional taxonomy (Type, Phase, Readiness) combined with dependency tracking to determine the optimal next issue for development.

---

## Backlog Taxonomy

### 1. Issue Types (`type:*`)

**Purpose:** Categorize issues by their nature and impact.

| Label          | Description                            | Examples                                 |
| -------------- | -------------------------------------- | ---------------------------------------- |
| `type:feature` | User-facing features and functionality | Customer CRUD, Opportunity pipeline      |
| `type:infra`   | Infrastructure, DevOps, deployment     | CI/CD pipeline, Docker setup             |
| `type:config`  | Configuration, settings, environment   | ESLint rules, TypeScript config          |
| `type:qa`      | Quality assurance, testing, validation | E2E tests, integration tests             |
| `type:doc`     | Documentation and knowledge management | API docs, setup guides                   |
| `type:bug`     | Bug fixes and defect resolution        | Fix validation error, resolve sync issue |

### 2. Development Phases (`phase:*`)

**Purpose:** Group issues by delivery phase and architectural dependency.

| Label                  | Description                              | Dependencies            |
| ---------------------- | ---------------------------------------- | ----------------------- |
| `phase:P01-foundation` | Foundation & Infrastructure              | None (or minimal)       |
| `phase:P02-skeleton`   | Walking Skeleton & First Deployment      | Requires P01 foundation |
| `phase:P03-mvp`        | MVP phase with user-facing functionality | Requires P01 + P02      |
| `phase:future`         | Future phases (AI/Analytics)             | Requires MVP completion |

**Phase Dependencies:**

- P02 issues typically depend on P01 completion
- P03 issues typically depend on P01 + P02 completion
- Future phase issues depend on MVP completion

### 3. Readiness Status (`ready:*`)

**Purpose:** Indicate whether an issue is ready for development work.

| Label           | Description                                                      | State Mapping |
| --------------- | ---------------------------------------------------------------- | ------------- |
| `ready:dev`     | Ready for development - all dependencies met, requirements clear | → **Todo**    |
| `ready:refine`  | Needs refinement - requirements unclear or need design work      | → **Backlog** |
| `ready:blocked` | Blocked by dependencies - cannot start until blockers resolved   | → **Backlog** |

**State Rules:**

- `ready:dev` → State: **Todo** (ready to pick up)
- `ready:refine` → State: **Backlog** (needs work before dev)
- `ready:blocked` → State: **Backlog** (waiting on dependencies)

### 4. Complexity Labels (`complexity:*`)

**Purpose:** Estimate development effort for capacity planning.

| Label           | Estimated Time | Use Case                              |
| --------------- | -------------- | ------------------------------------- |
| `complexity:XS` | 1-2 hours      | Simple config, small fixes            |
| `complexity:S`  | 2-4 hours      | Standard features, straightforward    |
| `complexity:M`  | 4-8 hours      | Moderate complexity, some integration |
| `complexity:L`  | 1-2 days       | Complex features, multiple components |
| `complexity:XL` | 2+ days        | Very complex, may need breakdown      |

### 5. Priority Labels (`priority:*`)

**Purpose:** Indicate business/technical importance.

| Label               | Description                            | Selection Weight |
| ------------------- | -------------------------------------- | ---------------- |
| `priority:critical` | Blocking or urgent - must be done soon | Highest          |
| `priority:high`     | Important for current iteration        | High             |
| `priority:medium`   | Standard importance                    | Medium           |
| `priority:low`      | Nice to have or future consideration   | Low              |

---

## Next Issue Selection Algorithm

### Algorithm Overview

The "next issue" selection follows a deterministic, multi-criteria filtering and sorting approach:

```
1. FILTER: ready:dev AND state:Todo
2. SORT BY:
   a. Phase (P01 → P02 → P03 → future)
   b. Priority (critical → high → medium → low)
   c. Complexity (XS → S → M → L → XL)
   d. Created date (oldest first)
3. SELECT: First issue from sorted list
```

### Detailed Selection Rules

#### Step 1: Filter Candidates

**Include issues that:**

- Have `ready:dev` label (ready for development)
- Are in `Todo` state (not in progress, not done)
- Are not `Canceled` or `Duplicate`

**Exclude issues that:**

- Have `ready:blocked` (waiting on dependencies)
- Have `ready:refine` (needs requirements work)
- Are in `Done`, `In Progress`, `In Review`, `Canceled`, `Duplicate` states

#### Step 2: Sort by Phase

**Phase Priority Order:**

1. `phase:P01-foundation` (highest priority - must complete first)
2. `phase:P02-skeleton` (second priority - depends on P01)
3. `phase:P03-mvp` (third priority - depends on P01+P02)
4. `phase:future` (lowest priority - post-MVP)

**Rationale:** Foundation issues must be completed before skeleton, skeleton before MVP. This ensures architectural dependencies are met.

#### Step 3: Sort by Priority

**Priority Order (within same phase):**

1. `priority:critical` (blocking or urgent)
2. `priority:high` (important for iteration)
3. `priority:medium` (standard)
4. `priority:low` (nice to have)

**Rationale:** Critical issues block other work or are urgent. High priority issues are important for current goals.

#### Step 4: Sort by Complexity

**Complexity Order (within same phase+priority):**

1. `complexity:XS` (quick wins, build momentum)
2. `complexity:S` (standard work)
3. `complexity:M` (moderate effort)
4. `complexity:L` (significant effort)
5. `complexity:XL` (may need breakdown)

**Rationale:** Start with smaller issues to build momentum and deliver value quickly. Larger issues may need breakdown if they're too complex.

#### Step 5: Sort by Created Date

**Date Order (within same phase+priority+complexity):**

- Oldest first (FIFO - first in, first out)

**Rationale:** Ensures issues don't get stuck in backlog indefinitely. Older issues that meet criteria should be addressed.

### Algorithm Pseudocode

```typescript
function selectNextIssue(issues: Issue[]): Issue | null {
  // Step 1: Filter candidates
  const candidates = issues.filter(
    (issue) =>
      issue.labels.includes("ready:dev") &&
      issue.state === "Todo" &&
      !["Done", "In Progress", "In Review", "Canceled", "Duplicate"].includes(
        issue.state,
      ),
  );

  if (candidates.length === 0) {
    return null; // No issues ready
  }

  // Step 2-5: Sort by phase, priority, complexity, date
  const sorted = candidates.sort((a, b) => {
    // Phase comparison (P01 < P02 < P03 < future)
    const phaseOrder = {
      "P01-foundation": 1,
      "P02-skeleton": 2,
      "P03-mvp": 3,
      future: 4,
    };
    const phaseA = extractPhase(a.labels);
    const phaseB = extractPhase(b.labels);
    if (phaseOrder[phaseA] !== phaseOrder[phaseB]) {
      return phaseOrder[phaseA] - phaseOrder[phaseB];
    }

    // Priority comparison (critical < high < medium < low)
    const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    const priorityA = extractPriority(a.labels);
    const priorityB = extractPriority(b.labels);
    if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
      return priorityOrder[priorityA] - priorityOrder[priorityB];
    }

    // Complexity comparison (XS < S < M < L < XL)
    const complexityOrder = { XS: 1, S: 2, M: 3, L: 4, XL: 5 };
    const complexityA = extractComplexity(a.labels);
    const complexityB = extractComplexity(b.labels);
    if (complexityOrder[complexityA] !== complexityOrder[complexityB]) {
      return complexityOrder[complexityA] - complexityOrder[complexityB];
    }

    // Date comparison (oldest first)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return sorted[0]; // Return first (highest priority) issue
}
```

### Example Selection

**Scenario:** Agent needs to pick next issue.

**Available Issues:**

1. KOM-19: Setup pnpm workspace (`phase:P01-foundation`, `priority:critical`, `complexity:S`, `ready:dev`, `Todo`)
2. KOM-32: Setup CD pipeline (`phase:P01-foundation`, `priority:critical`, `complexity:L`, `ready:blocked`, `Backlog`)
3. KOM-22: Customer entity (`phase:P03-mvp`, `priority:critical`, `complexity:XL`, `ready:blocked`, `Backlog`)
4. KOM-26: ESLint/Prettier (`phase:P01-foundation`, `priority:high`, `complexity:S`, `ready:dev`, `Todo`)

**Selection Process:**

1. **Filter:** Only KOM-19 and KOM-26 have `ready:dev` and are in `Todo` state
2. **Sort by Phase:** Both are P01-foundation (tie)
3. **Sort by Priority:** KOM-19 is `critical`, KOM-26 is `high` → **KOM-19 wins**

**Result:** **KOM-19** is selected as the next issue.

---

## Dependency Management

### Dependency Types

**Blocked By (Required Dependencies):**

- Issue cannot start until blocker is completed
- Marked with `ready:blocked` label
- State: `Backlog`
- Example: KOM-22 (Customer) blocked by KOM-21 (Keycloak auth)

**Enables (Dependent Issues):**

- Issue enables other issues to start
- Not a blocker, but creates value
- Example: KOM-22 (Customer) enables KOM-24 (Opportunity pipeline)

### Dependency Rules

1. **Explicit Dependencies:** All dependencies must be documented in issue description using format:

   ```
   **Dependencies:**
   * Blocked by: [KOM-XX] Issue title
   * Enables: [KOM-YY] Issue title
   ```

2. **Readiness Updates:** When a blocking issue is completed:
   - Check all issues blocked by it
   - If all blockers are resolved, update to `ready:dev`
   - Move state from `Backlog` to `Todo`

3. **Phase Dependencies:** Issues in later phases typically depend on earlier phases:
   - P02 issues may depend on P01
   - P03 issues may depend on P01 + P02
   - This is enforced by the phase ordering in selection algorithm

---

## Backlog Maintenance

### When to Update Readiness

**Mark as `ready:dev`:**

- All blocking dependencies are completed
- Requirements are clear and documented
- Technical approach is understood
- No design or discovery work needed

**Mark as `ready:refine`:**

- Requirements are unclear or incomplete
- Design work is needed
- Technical approach needs research
- Acceptance criteria need definition

**Mark as `ready:blocked`:**

- Has blocking dependencies that are not completed
- Waiting on external factors (API access, design approval, etc.)
- Cannot start until blockers resolved

### State Transitions

**Workflow:**

```
Backlog (ready:blocked/ready:refine)
  ↓ [dependencies resolved / refinement complete]
Todo (ready:dev)
  ↓ [work started]
In Progress
  ↓ [PR created]
In Review
  ↓ [merged]
Done
```

**Automated Updates:**

- When blocking issue is marked `Done` → Check dependent issues → Update to `ready:dev` if all blockers resolved
- When issue moves to `In Progress` → Remove from `Todo` selection pool
- When issue is `Done` → Remove from all selection pools

---

## Current Backlog Status

### Foundation Phase (P01) - Ready for Development

**Critical Priority:**

- ✅ KOM-19: Setup pnpm workspace (`ready:dev`, `Todo`)
- ✅ KOM-20: Configure Docker Compose (`ready:dev`, `Todo`)
- ⏳ KOM-32: Setup CD pipeline (`ready:blocked` by KOM-23, `Backlog`)

**High Priority:**

- ✅ KOM-26: Configure ESLint/Prettier (`ready:dev`, `Todo`)

### Skeleton Phase (P02) - Blocked

**Critical Priority:**

- ⏳ KOM-21: Keycloak authentication (`ready:blocked` by KOM-20, `Backlog`)
- ⏳ KOM-27: React PWA shell (`ready:blocked` by KOM-21, `Backlog`)

### MVP Phase (P03) - Blocked

**Critical Priority:**

- ⏳ KOM-22: Customer entity (`ready:blocked` by KOM-21, `Backlog`)
- ⏳ KOM-38: RBAC guards (`ready:blocked` by KOM-21, `Backlog`)
- ⏳ KOM-64: Audit logging (`ready:blocked` by KOM-38, `Backlog`)

**High Priority:**

- ⏳ KOM-24: Opportunity pipeline (`ready:blocked` by KOM-22, `Backlog`)
- ⏳ KOM-25: Executive dashboard (`ready:blocked` by KOM-24 + KOM-22, `Backlog`)
- ⏳ KOM-39: Project entity (`ready:blocked` by KOM-24, `Backlog`)
- ⏳ KOM-40: Invoice entity (`ready:blocked` by KOM-39, `Backlog`)

---

## Implementation Notes

### Label Creation

Readiness labels (`ready:dev`, `ready:refine`, `ready:blocked`) are auto-created by Linear when first added to an issue. No manual label creation needed.

### State Updates

States are updated using Linear MCP `update_issue` with `state` parameter:

- Use state name: `"Todo"`, `"Backlog"`, `"In Progress"`, etc.
- States are team-specific and defined in Linear workspace

### Dependency Tracking

Dependencies are tracked in issue descriptions using markdown format:

```markdown
**Dependencies:**

- Blocked by: [KOM-XX] Issue title
- Enables: [KOM-YY] Issue title
```

For automated dependency resolution, consider using Linear's built-in "blocks" and "is blocked by" relations in future iterations.

---

## Agent Instructions

### How to Pick the Next Issue

1. **Query Linear:** Get all issues with `ready:dev` label and `Todo` state
2. **Apply Algorithm:** Sort by phase → priority → complexity → date
3. **Select:** Pick first issue from sorted list
4. **Verify:** Check that issue has no unresolved blockers
5. **Start Work:** Move issue to `In Progress` and begin development

### When Dependencies Resolve

1. **Check Blockers:** When an issue is marked `Done`, find all issues that list it as a blocker
2. **Verify Readiness:** For each dependent issue, check if ALL blockers are resolved
3. **Update Status:** If all blockers resolved:
   - Add `ready:dev` label (or update from `ready:blocked`)
   - Change state from `Backlog` to `Todo`
   - Remove `ready:blocked` label if present

### Example Agent Workflow

```typescript
// 1. Get next issue
const nextIssue = await selectNextIssue(linearIssues);

// 2. Verify it's ready
if (nextIssue.labels.includes("ready:dev") && nextIssue.state === "Todo") {
  // 3. Start work
  await updateIssue(nextIssue.id, { state: "In Progress" });

  // 4. Begin development
  // ... implement feature ...

  // 5. Check dependent issues when done
  if (nextIssue.status === "Done") {
    const dependents = await findDependentIssues(nextIssue.id);
    for (const dependent of dependents) {
      if (allBlockersResolved(dependent)) {
        await updateIssue(dependent.id, {
          labels: [
            ...dependent.labels.filter((l) => !l.startsWith("ready:")),
            "ready:dev",
          ],
          state: "Todo",
        });
      }
    }
  }
}
```

---

## References

- Product Vision: `docs/product-vision/Produktvision für Projekt KOMPASS (Nordstern-Direktive).md`
- Architecture: `docs/architecture/system-architecture.md`
- Linear Team: KOMPASS (KOM)
- Linear Projects: Foundation Phase (P01), Skeleton Phase (P02), MVP Phase (P03)

---

## Changelog

- **2025-01-28:** Initial backlog strategy document created
- **2025-01-28:** Applied taxonomy to foundation phase issues (KOM-19, KOM-20, KOM-26)
- **2025-01-28:** Documented next-issue selection algorithm
- **2025-01-28:** Established readiness label system (`ready:dev`, `ready:refine`, `ready:blocked`)
