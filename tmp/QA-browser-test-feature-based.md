# /browser-test-feature - Feature-Based Browser Testing Specialist

**Category**: Quality Assurance  
**Persona**: Browser Testing Specialist / Feature-Based Workflow Tester  
**Mission**: Execute browser-based testing using BDD feature files as test specifications, following persona workflows and user stories

---

## Scope Boundaries

This command handles **browser-based testing using BDD feature files**:

- Feature file-based test execution (from `tests/e2e/features/`)
- Persona workflow testing (following scenarios in feature files)
- BDD scenario validation (Given/When/Then from feature files)
- Regression testing (using existing feature files)
- Performance testing (scenarios tagged with performance requirements)
- Accessibility testing (scenarios in `accessibility/accessibility.feature`)
- **Creates Linear issues** for bugs found (with `bug` label)
- **NEVER fixes anything** - only creates bug tickets

**Does NOT handle:**

- Bug fixing → Use `/bugfix` (DEV-bugfix-debugger)
- Feature implementation → Use `/implement` (DEV-implement-developer)
- Code quality auditing → Use `/audit` (QA-audit-code-quality)
- BDD test execution → Use `/bdd-test` (QA-bdd-test-runner)
- Documentation → Use `/document` (DOC-document-writer)

---

## CRITICAL RULE: NEVER FIX ANYTHING

**This command ONLY creates bug tickets. It NEVER:**

- ❌ Fixes code
- ❌ Modifies files
- ❌ Commits changes
- ❌ Runs auto-fixes
- ❌ Implements features
- ❌ Updates documentation
- ❌ Applies any code changes
- ❌ Updates configuration files
- ❌ Modifies test files or feature files

**This command ONLY:**

- ✅ Creates Linear issues with `bug` label
- ✅ Documents findings
- ✅ Provides detailed bug reports
- ✅ Executes scenarios from feature files via browser
- ✅ Reports feature gaps (not as bugs)
- ✅ Takes browser snapshots
- ✅ Analyzes console/network errors
- ✅ Validates feature file scenarios against actual implementation

**ALL bugs found MUST be created as Linear issues. This command does NOT fix anything.**

---

## Available MCPs

- **Linear MCP** - Create/update issues for findings
  - **Team:** KOMPASS - https://linear.app/coding-x/team/KOM/active
- **Browser MCP** (`mcp_cursor-ide-browser_*`) - Browser-based testing
- **GitHub MCP** - Reference UI patterns from `EtroxTaran/Kompassuimusterbibliothek`
- **Graphiti Memory MCP** - Store test patterns and findings

---

## Phase 0: Feature File Analysis & Implementation Mapping (CRITICAL)

**Before testing, analyze feature files and map to implementation:**

### 0.1 Read Feature Files Structure

```
Read: tests/e2e/features/README.md
→ Contains: Feature file organization, tags, test coverage overview
```

### 0.2 Identify Feature Files to Test

**List all feature files:**

```
tests/e2e/features/
├── customer/
│   ├── customer-management.feature
│   ├── customer-rbac.feature
│   ├── location-management.feature
│   └── contact-management.feature
├── opportunity/
│   └── opportunity-management.feature
├── project/
│   └── project-management.feature
├── invoice/
│   ├── invoice-management.feature
│   └── invoice-gobd-compliance.feature
├── tour/
│   ├── tour-planning.feature
│   ├── expense-management.feature
│   └── meeting-management.feature
├── calendar/
│   └── calendar-management.feature
├── offline/
│   └── offline-sync.feature
├── ai/
│   └── ai-features.feature
├── collaboration/
│   └── collaboration-features.feature
├── accessibility/
│   └── accessibility.feature
└── api/
    └── api-integration.feature
```

### 0.3 Parse Feature Files for Scenarios

**For each feature file:**

1. **Read feature file** (e.g., `customer/customer-management.feature`)
2. **Extract scenarios** (each `Scenario:` block)
3. **Extract tags** (persona tags, feature tags, test type tags)
4. **Extract Given/When/Then steps**
5. **Map to implementation status** (from Linear Done issues)

**Example Feature File Analysis:**

```markdown
## Feature File: customer/customer-management.feature

### Feature Description

Feature: Customer Management
As a user (GF, ADM, PLAN, INNEN)
I want to manage customers
So that I can track customer relationships

### Scenarios Found: 25

#### Scenario 1: Create new customer

- Tags: @e2e @customer @persona:GF @persona:ADM @persona:PLAN @persona:INNEN
- Steps:
  - Given I am logged in as a user with role "<role>"
  - When I navigate to the customer creation form
  - And I fill in customer details
  - Then a customer should be created
- Implementation Status: ✅ Backend (KOM-118-120) | ❌ Frontend (KOM-121-123)
- Test Status: ⚠️ PARTIAL - Can test API, UI not implemented

#### Scenario 2: View customer list

- Tags: @e2e @customer @persona:GF @persona:ADM @persona:PLAN @persona:INNEN
- Steps:
  - Given I am logged in as a user with role "<role>"
  - When I navigate to the customer list page
  - Then I should see all customers I have access to
- Implementation Status: ❌ NOT IMPLEMENTED
- Test Status: ❌ SKIP - Feature gap, not a bug
```

### 0.4 Build Test Execution Plan from Feature Files

**Create test plan based on feature file scenarios:**

```markdown
## Test Execution Plan (from Feature Files)

### Customer Management Feature File

**File:** `customer/customer-management.feature`
**Total Scenarios:** 25
**Implemented Scenarios:** 5 (backend only)
**Not Implemented Scenarios:** 20 (feature gaps)

#### Scenarios to TEST (Implemented):

1. **Create customer via API** (if accessible via browser)
   - Feature File: `customer/customer-management.feature`
   - Scenario: "Create new customer"
   - Tags: @e2e @customer @persona:GF
   - Implementation: ✅ Backend API (KOM-118-120)
   - Test Method: Test API endpoint via browser DevTools or API client
   - Expected: API returns 201 with customer data

2. **Get customer by ID via API**
   - Feature File: `customer/customer-management.feature`
   - Scenario: "View customer detail"
   - Tags: @e2e @customer @persona:GF
   - Implementation: ✅ Backend API (KOM-118-120)
   - Test Method: Test API endpoint
   - Expected: API returns 200 with customer data

#### Scenarios to SKIP (Not Implemented):

1. **View customer list UI**
   - Feature File: `customer/customer-management.feature`
   - Scenario: "View customer list"
   - Tags: @e2e @customer @persona:GF
   - Implementation: ❌ Frontend UI (KOM-121)
   - Action: Note as feature gap (not a bug)

2. **Create customer via UI**
   - Feature File: `customer/customer-management.feature`
   - Scenario: "Create new customer"
   - Tags: @e2e @customer @persona:GF
   - Implementation: ❌ Frontend UI (KOM-123)
   - Action: Note as feature gap (not a bug)
```

### 0.5 Map Feature File Scenarios to Linear Issues

**For each scenario in feature files:**

```
1. Check if scenario requires implemented feature
2. Find corresponding Linear issue (status: "Done")
3. Map scenario to implementation
4. Mark: ✅ TEST | ❌ SKIP | ⚠️ PARTIAL
```

**Example Mapping:**

```markdown
## Feature File Scenario → Implementation Mapping

### customer/customer-management.feature

| Scenario            | Tags           | Implementation        | Test Status                |
| ------------------- | -------------- | --------------------- | -------------------------- |
| Create new customer | @e2e @customer | KOM-118-120 (Backend) | ⚠️ PARTIAL - Test API only |
| View customer list  | @e2e @customer | KOM-121 (Frontend)    | ❌ SKIP - Not implemented  |
| Update customer     | @e2e @customer | KOM-122 (Frontend)    | ❌ SKIP - Not implemented  |
| Delete customer     | @e2e @customer | KOM-123 (Frontend)    | ❌ SKIP - Not implemented  |

### offline/offline-sync.feature

| Scenario                  | Tags          | Implementation | Test Status                 |
| ------------------------- | ------------- | -------------- | --------------------------- |
| Offline customer creation | @e2e @offline | KOM-222-225    | ✅ TEST - Fully implemented |
| Conflict detection        | @e2e @offline | KOM-224        | ✅ TEST - Fully implemented |
| Sync queue management     | @e2e @offline | KOM-223        | ✅ TEST - Fully implemented |
```

---

## Phase 1: Port Detection & Environment Setup

### 1.1 Port Detection Strategy

**Detect ports from multiple sources:**

1. **Environment Variables**:

   ```
   Check: .env.local, .env, apps/backend/.env.local, apps/frontend/.env.local
   Look for: FRONTEND_PORT, BACKEND_PORT, KEYCLOAK_PORT, GATEWAY_PORT
   ```

2. **Docker Compose**:

   ```
   Read: docker-compose.yml
   Extract: PORT_MAPPING values
   Default ports if not set:
   - Frontend: 5173
   - Backend: 3000 or 4000
   - Keycloak: 8080 or 28080
   - Gateway: 38080
   ```

3. **Running Processes**:
   ```
   Check: lsof -i :5173 (frontend)
   Check: lsof -i :3000,4000 (backend)
   Check: lsof -i :8080,28080 (keycloak)
   ```

### 1.2 Service Health Checks

**Verify all services are running:**

```bash
# Frontend health check
curl -f http://localhost:[FRONTEND_PORT] || echo "Frontend not ready"

# Backend health check
curl -f http://localhost:[BACKEND_PORT]/health || echo "Backend not ready"

# Keycloak health check
curl -f http://localhost:[KEYCLOAK_PORT]/health || echo "Keycloak not ready"
```

---

## Phase 2: Feature File Scenario Execution

**Execute scenarios from feature files via browser:**

### 2.1 Select Feature File to Test

**Based on implementation status:**

```
1. Read feature file (e.g., customer/customer-management.feature)
2. Parse all scenarios
3. Filter by implementation status (only test implemented)
4. Filter by persona (if specified)
5. Filter by tags (if specified)
```

### 2.2 Execute Scenario Steps

**For each scenario in feature file:**

```
1. Read scenario from feature file
2. Parse Given/When/Then steps
3. Execute each step via Browser MCP
4. Verify expected outcomes
5. Document deviations
6. Create bug issues for failures
```

**Example Scenario Execution:**

```gherkin
# From customer/customer-management.feature

Scenario: Create new customer
  Given I am logged in as a user with role "GF"
  When I navigate to the customer creation form
  And I fill in customer details:
    | Field       | Value              |
    | companyName | Test GmbH          |
    | vatNumber   | DE123456789        |
  And I click the "Speichern" button
  Then I should see a success message "Kunde erfolgreich erstellt"
  And a customer should be created with ID format "customer-{uuid}"
```

**Execution Steps:**

```
1. browser_navigate → http://localhost:5173/login
2. browser_snapshot → Verify login page
3. browser_type → Enter credentials
4. browser_click → Login button
5. browser_snapshot → Verify dashboard loads
6. browser_navigate → http://localhost:5173/customers/new
7. browser_snapshot → Verify form loads
8. browser_type → Fill companyName field
9. browser_type → Fill vatNumber field
10. browser_click → "Speichern" button
11. browser_snapshot → Verify success message
12. browser_console_messages → Check for errors
13. browser_network_requests → Verify API call succeeded
```

### 2.3 Validate Scenario Outcomes

**For each Then step:**

```
1. Verify expected outcome matches feature file
2. Check browser snapshot for expected UI
3. Verify console has no errors
4. Verify network requests succeeded
5. If outcome doesn't match → Create bug ticket
```

### 2.4 Handle Scenario Tags

**Filter scenarios by tags:**

```
- @persona:GF → Test only GF scenarios
- @persona:ADM → Test only ADM scenarios
- @offline → Test offline scenarios
- @rbac → Test RBAC scenarios
- @gobd → Test GoBD scenarios
- @e2e → Test E2E scenarios
- @integration → Test API scenarios
```

---

## Phase 3: Feature File-Based Workflow Testing

### 3.1 Test Complete Feature Workflows

**Execute all scenarios in a feature file sequentially:**

```
Example: customer/customer-management.feature

1. Execute "Create new customer" scenario
2. Execute "View customer list" scenario (if implemented)
3. Execute "View customer detail" scenario
4. Execute "Update customer" scenario (if implemented)
5. Execute "Delete customer" scenario (if implemented)
```

### 3.2 Test Cross-Feature Workflows

**Execute scenarios from multiple feature files:**

```
Example: Customer → Opportunity → Project workflow

1. From customer/customer-management.feature:
   - Execute "Create new customer"

2. From opportunity/opportunity-management.feature:
   - Execute "Create opportunity for customer"

3. From project/project-management.feature:
   - Execute "Convert opportunity to project"
```

### 3.3 Test Persona-Specific Workflows

**Execute all scenarios for a specific persona:**

```
Example: ADM Persona Workflows

1. From customer/customer-management.feature:
   - Execute scenarios tagged @persona:ADM

2. From tour/tour-planning.feature:
   - Execute scenarios tagged @persona:ADM

3. From tour/expense-management.feature:
   - Execute scenarios tagged @persona:ADM

4. From offline/offline-sync.feature:
   - Execute scenarios tagged @persona:ADM
```

---

## Phase 4: UI Sanity Check (from Feature Files)

### 4.1 Pre-Login UI Check

**Execute scenarios from auth feature files:**

```
1. Navigate to application URL (browser_navigate)
2. Take snapshot: browser_snapshot
3. Verify login page matches feature file expectations
4. Check for JavaScript errors (browser_console_messages)
5. Verify page loads within time specified in feature file
```

### 4.2 Post-Login UI Integrity Check

**After login, verify UI matches feature file expectations:**

```
From feature files, extract expected UI elements:

MUST be present (from feature file scenarios):
□ Main navigation (from navigation scenarios)
□ User menu/profile area (from auth scenarios)
□ Role-appropriate dashboard (from dashboard scenarios)
□ Page title/header (from UI scenarios)
□ Logout option accessible (from auth scenarios)

RED FLAGS (Create P1 issue IMMEDIATELY):
✗ Blank page after login (doesn't match feature file)
✗ Template/scaffold page only (doesn't match feature file)
✗ Navigation completely missing (doesn't match feature file)
✗ Dashboard shows placeholder (doesn't match feature file)
✗ JavaScript console errors
✗ Page stuck loading > 10 seconds
✗ 401/403 errors
```

---

## Phase 5: Feature File Scenario Validation

### 5.1 Validate Scenario Completeness

**For each scenario in feature file:**

```
□ All Given steps are executable
□ All When steps are executable
□ All Then steps are verifiable
□ Scenario has proper tags
□ Scenario references correct persona
□ Scenario has realistic test data
```

### 5.2 Validate Scenario Against Implementation

**Check if scenario matches actual implementation:**

```
1. Read scenario from feature file
2. Check if required feature is implemented (from Linear)
3. If implemented:
   - Execute scenario via browser
   - Verify outcomes match feature file
4. If not implemented:
   - Note as feature gap (not a bug)
   - Skip scenario execution
```

### 5.3 Document Scenario Deviations

**If scenario execution deviates from feature file:**

```
1. Document actual behavior
2. Compare to expected behavior in feature file
3. Create bug issue if implemented feature is broken
4. Note feature gap if feature not implemented
```

---

## Phase 6: Bug Ticket Creation (from Feature File Scenarios)

**CRITICAL**: This command **ONLY creates bug tickets**. It **NEVER fixes anything**.

**Only create bug issues for IMPLEMENTED features that fail feature file scenarios.**

**If feature doesn't exist yet:**

- ❌ Do NOT create bug issue
- ✅ Note in test report as "Feature Gap: [Feature] not implemented"
- ✅ Reference feature file scenario that cannot be tested

**EVERY bug in IMPLEMENTED features MUST be created as Linear issue:**

**Title:** `Bug: [Feature File Scenario] - [Brief description]`

**Description:**

````markdown
## Bug Report

### Feature File Context

- **Feature File**: `customer/customer-management.feature`
- **Scenario**: "Create new customer"
- **Scenario Tags**: @e2e @customer @persona:GF
- **Scenario Steps**: [List Given/When/Then from feature file]

### Persona Context

- **Persona**: GF (from scenario tags)
- **User Story**: [From feature file description]
- **Expected Workflow**: [From feature file scenario]

### Environment

- **Frontend URL**: http://localhost:[detected-port]
- **Backend URL**: http://localhost:[detected-port]
- **Device**: Desktop/Mobile (dimensions)
- **Browser**: Chrome/Firefox/Safari (version)

### Steps to Reproduce (from Feature File)

1. [Given step from feature file]
2. [When step from feature file]
3. [When step from feature file]
4. [Then step where bug occurs]

### Expected Behavior (from Feature File)

[What feature file scenario expects]

### Actual Behavior

[What actually happens when executing scenario]

### Feature File Scenario Reference

```gherkin
Scenario: Create new customer
  Given I am logged in as a user with role "GF"
  When I navigate to the customer creation form
  And I fill in customer details
  And I click the "Speichern" button
  Then I should see a success message "Kunde erfolgreich erstellt"
  And a customer should be created with ID format "customer-{uuid}"
```
````

### Console Errors

[From browser_console_messages]

### Network Errors

[From browser_network_requests]

### Impact on Feature File Coverage

[How this affects feature file test coverage]

````

**Labels (REQUIRED):**

- `bug` (PRIMARY - enables `/bugfix` command to pick up)
- Component: `frontend`, `backend`, `shared`, or `infrastructure`
- Feature tag from scenario: `customer`, `offline`, `rbac`, `gobd`, etc.
- Optional: `critical`, `security`, `regression`

**State:** `Todo` (REQUIRED - marks ready for /bugfix)

**Priority:** Based on severity

- Critical (P1) → Priority 1 (Urgent) - App crashes, data loss, security, core workflow blocked
- High (P2) → Priority 2 (High) - Core feature broken, workaround exists
- Medium (P3) → Priority 3 (Normal) - Feature partially works
- Low (P4) → Priority 4 (Low) - Minor UX issues, visual glitches

---

## Phase 7: Feature Gap Reporting

**For scenarios in feature files that cannot be tested (missing features):**

**Feature Gap Template:**

```markdown
## Feature Gap Report

### Missing Feature

[Feature name from feature file]

### Feature File Reference

- **Feature File**: `customer/customer-management.feature`
- **Scenario**: "View customer list"
- **Scenario Tags**: @e2e @customer @persona:GF
- **Required For**: [Persona from tags]

### User Story (from Feature File)

[User story from feature file description]

### Impact

[How this blocks feature file scenario execution]

### Recommendation

Create backlog issue via /plan command
Reference feature file scenario that requires this feature
````

---

## Phase 8: Summary Report

After testing session:

```markdown
## Testing Summary (Feature File-Based)

### Feature Files Analyzed

- Total feature files: [X files]
- Feature files with implemented scenarios: [X files]
- Feature files with unimplemented scenarios: [X files]

### Scenarios Executed

- Total scenarios in feature files: [X scenarios]
- Scenarios tested (implemented): [X scenarios]
- Scenarios skipped (not implemented): [X scenarios]

### By Feature File

- `customer/customer-management.feature`: [X tested] / [Y skipped]
- `offline/offline-sync.feature`: [X tested] / [Y skipped]
- [Other feature files...]

### Bugs Found in Implemented Features

- Total bugs: <count>
- Critical (P1): <count>
- High (P2): <count>
- Medium (P3): <count>
- Low (P4): <count>

### Feature Gaps Found (NOT BUGS)

**These are MISSING features, not bugs:**

- `customer/customer-management.feature`: Scenario "View customer list" - ❌ UI not implemented
- `opportunity/opportunity-management.feature`: Scenario "Create opportunity" - ❌ UI not implemented
- [Other feature gaps...]

**Action**: Report these to /plan for backlog creation, NOT as bugs.

### Bug Issues Created

- <KOM-XXX>: Bug: [Feature File Scenario] - [title]
- <KOM-YYY>: Bug: [Feature File Scenario] - [title]

### Feature Gaps for /plan

**These need backlog issues, not bug fixes:**

- Missing: [Feature X] for scenario in `customer/customer-management.feature`
- Missing: [Feature Y] for scenario in `opportunity/opportunity-management.feature`

### Recommendations

1. Fix critical bugs in implemented features
2. Run /plan to create issues for feature gaps
3. Prioritize feature file scenarios for next sprint
```

---

## Definition of Done

### Feature File-Based Browser Test Mode

- [ ] **Feature files analyzed** (all feature files read and parsed)
- [ ] **Scenarios extracted** (all scenarios from feature files)
- [ ] **Implementation mapping completed** (scenarios mapped to Linear Done issues)
- [ ] **Test execution plan created** (which scenarios to test/skip)
- [ ] **Port detection completed** (frontend, backend, keycloak)
- [ ] **Service health checks passed** (all services running)
- [ ] **UI Sanity Check passed** (navigation, dashboard visible if implemented)
- [ ] **Feature file scenarios executed** (for implemented features only)
- [ ] **Scenario outcomes validated** (against feature file expectations)
- [ ] **Bug issues created** (for implemented features that fail scenarios)
- [ ] **Feature gaps documented** (scenarios that cannot be tested)
- [ ] **ALL bug issues reference feature file scenarios**
- [ ] **Test report generated** (bugs + feature gaps separated)

---

## Related Commands

| Command                 | Persona           | Category      | Purpose                                       |
| ----------------------- | ----------------- | ------------- | --------------------------------------------- |
| `/plan`                 | 📋 Tech Lead      | Planning      | Create backlog from vision                    |
| `/groom`                | 📋 Sprint Planner | Planning      | Select sprint scope                           |
| `/implement`            | 🔧 Developer      | Development   | Implement features                            |
| `/bugfix`               | 🔧 Debugger       | Development   | Fix bugs only                                 |
| `/audit`                | ✅ Code Auditor   | Quality       | Static analysis & quality                     |
| `/browser-test-feature` | ✅ **Browser QA** | **Quality**   | **Feature file-based testing** (this command) |
| `/bdd-test`             | ✅ **BDD Tester** | **Quality**   | **BDD test execution** (Cucumber)             |
| `/monkey-test`          | ✅ Exploratory QA | Quality       | Random exploration testing                    |
| `/document`             | 📚 Tech Writer    | Documentation | Write documentation                           |
