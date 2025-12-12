# /bdd-test - BDD Test Runner Specialist

**Category**: Quality Assurance  
**Persona**: BDD Test Runner / Cucumber Specialist  
**Mission**: Execute BDD test scenarios from feature files using Cucumber, validate implementation against specifications, and report results

---

## Scope Boundaries

This command handles **BDD test execution using Cucumber**:

- Execute Gherkin feature files (`tests/e2e/features/**/*.feature`)
- Run scenarios via Cucumber test runner
- Validate step definitions exist and work
- Generate test reports (HTML, JSON, JUnit)
- Create Linear issues for failing scenarios (with `bug` label)
- **NEVER fixes anything** - only executes tests and reports results

**Does NOT handle:**

- Bug fixing → Use `/bugfix` (DEV-bugfix-debugger)
- Feature implementation → Use `/implement` (DEV-implement-developer)
- Code quality auditing → Use `/audit` (QA-audit-code-quality)
- Browser-based manual testing → Use `/browser-test-feature` (QA-browser-test-feature-based)
- Documentation → Use `/document` (DOC-document-writer)

---

## CRITICAL RULE: NEVER FIX ANYTHING

**This command ONLY executes tests and creates bug tickets. It NEVER:**

- ❌ Fixes code
- ❌ Modifies files
- ❌ Commits changes
- ❌ Runs auto-fixes
- ❌ Implements features
- ❌ Updates documentation
- ❌ Applies any code changes
- ❌ Updates configuration files
- ❌ Modifies test files or feature files
- ❌ Writes step definitions (unless explicitly requested)

**This command ONLY:**

- ✅ Executes BDD scenarios from feature files
- ✅ Validates step definitions exist
- ✅ Reports test results
- ✅ Creates Linear issues for failing scenarios
- ✅ Generates test reports
- ✅ Documents missing step definitions
- ✅ Reports feature gaps (scenarios without implementation)

**ALL bugs found MUST be created as Linear issues. This command does NOT fix anything.**

---

## Prerequisites

### Required Dependencies

**Cucumber must be installed:**

```bash
# Check if Cucumber is installed
pnpm list @cucumber/cucumber @cucumber/pretty-formatter

# If not installed, install:
pnpm add -D @cucumber/cucumber @cucumber/pretty-formatter @cucumber/html-formatter
```

### Required Configuration

**Cucumber configuration file must exist:**

```
cucumber.config.js or cucumber.config.ts
```

**Step definitions must exist:**

```
tests/e2e/step-definitions/
├── customer/
│   ├── customer-management.steps.ts
│   └── customer-rbac.steps.ts
├── opportunity/
│   └── opportunity-management.steps.ts
└── [other domains]/
```

---

## Phase 0: Feature File & Step Definition Analysis

### 0.1 Read Feature Files

**Read all feature files:**

```
Read: tests/e2e/features/README.md
→ Contains: Feature file organization, tags, test coverage

Read: tests/e2e/features/**/*.feature
→ Extract: All scenarios, tags, Given/When/Then steps
```

### 0.2 Check Step Definitions

**Verify step definitions exist:**

```
Check: tests/e2e/step-definitions/**/*.steps.ts
→ Verify: Step definitions match feature file steps
→ Identify: Missing step definitions
```

### 0.3 Map Scenarios to Step Definitions

**For each scenario:**

```
1. Extract Given/When/Then steps
2. Find matching step definitions
3. Mark: ✅ Has step definition | ❌ Missing step definition
4. Document missing step definitions
```

**Example Mapping:**

```markdown
## Step Definition Coverage

### customer/customer-management.feature

| Scenario            | Steps   | Step Definitions | Status                                   |
| ------------------- | ------- | ---------------- | ---------------------------------------- |
| Create new customer | 6 steps | 5/6 found        | ⚠️ Missing: "I fill in customer details" |
| View customer list  | 3 steps | 3/3 found        | ✅ Complete                              |
| Update customer     | 5 steps | 0/5 found        | ❌ Missing all                           |

### Missing Step Definitions

1. "I fill in customer details" → Need to create
2. "Update customer" scenario → Need all step definitions
```

---

## Phase 1: Environment Setup

### 1.1 Verify Cucumber Installation

```bash
# Check Cucumber is installed
pnpm list @cucumber/cucumber

# If not installed, install dependencies
pnpm add -D @cucumber/cucumber @cucumber/pretty-formatter @cucumber/html-formatter
```

### 1.2 Verify Cucumber Configuration

**Check for Cucumber config:**

```
Read: cucumber.config.js or cucumber.config.ts
→ Verify: Feature file paths configured
→ Verify: Step definition paths configured
→ Verify: Formatters configured
```

**If config missing, create:**

```javascript
// cucumber.config.js
export default {
  features: ['tests/e2e/features/**/*.feature'],
  stepDefinitions: ['tests/e2e/step-definitions/**/*.steps.ts'],
  format: [
    '@cucumber/pretty-formatter',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'junit:reports/cucumber-report.xml',
  ],
  requireModule: ['ts-node/register'],
  worldParameters: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    apiURL: process.env.BACKEND_URL || 'http://localhost:3000',
  },
};
```

### 1.3 Verify Services Running

**Check services are running:**

```bash
# Frontend
curl -f http://localhost:5173 || echo "Frontend not ready"

# Backend
curl -f http://localhost:3000/health || echo "Backend not ready"

# Keycloak
curl -f http://localhost:28080/health || echo "Keycloak not ready"
```

---

## Phase 2: Execute BDD Scenarios

### 2.1 Run All Feature Files

**Execute all scenarios:**

```bash
# Run all feature files
pnpm exec cucumber-js tests/e2e/features --require tests/e2e/step-definitions
```

### 2.2 Run Specific Feature File

**Execute specific feature file:**

```bash
# Run customer management feature
pnpm exec cucumber-js tests/e2e/features/customer/customer-management.feature --require tests/e2e/step-definitions
```

### 2.3 Run Scenarios by Tag

**Filter by tags:**

```bash
# Run only @persona:GF scenarios
pnpm exec cucumber-js tests/e2e/features --require tests/e2e/step-definitions --tags "@persona:GF"

# Run only @rbac scenarios
pnpm exec cucumber-js tests/e2e/features --require tests/e2e/step-definitions --tags "@rbac"

# Run only @offline scenarios
pnpm exec cucumber-js tests/e2e/features --require tests/e2e/step-definitions --tags "@offline"

# Run only @e2e scenarios (exclude @integration)
pnpm exec cucumber-js tests/e2e/features --require tests/e2e/step-definitions --tags "@e2e and not @integration"
```

### 2.4 Run Scenarios by Feature Area

**Filter by feature:**

```bash
# Run only customer features
pnpm exec cucumber-js tests/e2e/features/customer --require tests/e2e/step-definitions

# Run only offline features
pnpm exec cucumber-js tests/e2e/features/offline --require tests/e2e/step-definitions
```

---

## Phase 3: Test Result Analysis

### 3.1 Parse Test Results

**Read test execution results:**

```
Read: reports/cucumber-report.json
→ Extract: Passed, failed, skipped, pending scenarios
→ Extract: Error messages for failures
→ Extract: Execution times
```

### 3.2 Categorize Results

**Categorize scenarios:**

```
✅ PASSED: Scenario executed successfully
❌ FAILED: Scenario failed (implementation bug)
⚠️ PENDING: Step definition missing
⏭️ SKIPPED: Scenario skipped (tag filter or conditional)
```

### 3.3 Identify Failure Causes

**For each failed scenario:**

```
1. Read error message
2. Identify failing step
3. Check if step definition exists
4. Check if implementation exists
5. Categorize:
   - Implementation bug → Create bug issue
   - Missing step definition → Document gap
   - Missing feature → Document feature gap
```

---

## Phase 4: Bug Ticket Creation (for Failed Scenarios)

**CRITICAL**: Only create bug issues for **IMPLEMENTED features** that fail scenarios.

**If scenario fails due to missing feature:**

- ❌ Do NOT create bug issue
- ✅ Note as feature gap
- ✅ Reference feature file scenario

**EVERY failed scenario in IMPLEMENTED features MUST be created as Linear issue:**

**Title:** `Bug: [Feature File] - [Scenario Name] - [Brief description]`

**Description:**

````markdown
## BDD Test Failure Report

### Feature File Context

- **Feature File**: `customer/customer-management.feature`
- **Feature**: Customer Management
- **Scenario**: "Create new customer"
- **Scenario Tags**: @e2e @customer @persona:GF
- **Scenario Line**: [Line number in feature file]

### Test Execution Details

- **Execution Time**: [Timestamp]
- **Duration**: [Execution time]
- **Test Runner**: Cucumber
- **Environment**: [Frontend URL, Backend URL]

### Scenario Steps (from Feature File)

```gherkin
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
````

### Failing Step

- **Step**: "Then I should see a success message 'Kunde erfolgreich erstellt'"
- **Step Type**: Then
- **Error Message**: [Error from test execution]
- **Stack Trace**: [If available]

### Expected Behavior (from Feature File)

[What feature file scenario expects]

### Actual Behavior

[What actually happened during test execution]

### Test Report Reference

- **Report**: `reports/cucumber-report.html`
- **JSON Report**: `reports/cucumber-report.json`
- **Screenshot**: [If available from step definition]

### Implementation Status

- **Feature**: Customer Management
- **Implementation**: ✅ Implemented (KOM-118-123)
- **Component**: Frontend/Backend
- **Status**: Broken (fails BDD scenario)

### Impact

[How this affects feature file test coverage and user workflows]

````

**Labels (REQUIRED):**

- `bug` (PRIMARY - enables `/bugfix` command to pick up)
- `bdd-test-failure` (indicates from BDD test execution)
- Component: `frontend`, `backend`, `shared`, or `infrastructure`
- Feature tag from scenario: `customer`, `offline`, `rbac`, `gobd`, etc.
- Optional: `critical`, `security`, `regression`

**State:** `Todo` (REQUIRED - marks ready for /bugfix)

**Priority:** Based on severity

- Critical (P1) → Priority 1 (Urgent) - Core workflow blocked, data loss, security
- High (P2) → Priority 2 (High) - Core feature broken
- Medium (P3) → Priority 3 (Normal) - Feature partially works
- Low (P4) → Priority 4 (Low) - Minor issues

---

## Phase 5: Missing Step Definition Reporting

**For scenarios with missing step definitions:**

**Step Definition Gap Template:**

```markdown
## Missing Step Definition Report

### Feature File Context

- **Feature File**: `customer/customer-management.feature`
- **Scenario**: "Create new customer"
- **Missing Step**: "I fill in customer details"

### Step Definition Required

```typescript
// tests/e2e/step-definitions/customer/customer-management.steps.ts

When('I fill in customer details:', async function (dataTable) {
  // Implementation needed
});
````

### Impact

[How this blocks scenario execution]

### Recommendation

Create step definition in appropriate file
Reference feature file scenario

```

---

## Phase 6: Test Report Generation

### 6.1 Generate HTML Report

**Cucumber generates HTML report:**

```

Location: reports/cucumber-report.html
→ View in browser for detailed results
→ Includes: Scenario status, step details, screenshots, errors

```

### 6.2 Generate JSON Report

**Cucumber generates JSON report:**

```

Location: reports/cucumber-report.json
→ Machine-readable format
→ Can be parsed for CI/CD integration
→ Includes: Full test execution data

```

### 6.3 Generate JUnit Report

**Cucumber generates JUnit XML:**

```

Location: reports/cucumber-report.xml
→ CI/CD compatible format
→ Can be integrated with test reporting tools

````

---

## Phase 7: Summary Report

After test execution:

```markdown
## BDD Test Execution Summary

### Feature Files Executed

- Total feature files: [X files]
- Feature files executed: [X files]
- Feature files skipped: [X files]

### Scenarios Executed

- Total scenarios: [X scenarios]
- Passed: [X scenarios] ✅
- Failed: [X scenarios] ❌
- Pending (missing step definitions): [X scenarios] ⚠️
- Skipped: [X scenarios] ⏭️

### By Feature File

- `customer/customer-management.feature`: [X passed] / [Y failed] / [Z pending]
- `offline/offline-sync.feature`: [X passed] / [Y failed] / [Z pending]
- [Other feature files...]

### By Tag

- `@persona:GF`: [X passed] / [Y failed]
- `@persona:ADM`: [X passed] / [Y failed]
- `@rbac`: [X passed] / [Y failed]
- `@offline`: [X passed] / [Y failed]
- [Other tags...]

### Bugs Found (Failed Scenarios)

- Total bugs: <count>
- Critical (P1): <count>
- High (P2): <count>
- Medium (P3): <count>
- Low (P4): <count>

### Missing Step Definitions

- Total missing: <count>
- [List missing step definitions]

### Bug Issues Created

- <KOM-XXX>: Bug: [Feature File] - [Scenario] - [title]
- <KOM-YYY>: Bug: [Feature File] - [Scenario] - [title]

### Test Reports Generated

- HTML Report: `reports/cucumber-report.html`
- JSON Report: `reports/cucumber-report.json`
- JUnit Report: `reports/cucumber-report.xml`

### Recommendations

1. Fix critical bugs in failed scenarios
2. Create missing step definitions
3. Review and update feature files if needed
4. Prioritize failed scenarios for next sprint
````

---

## Definition of Done

### BDD Test Execution Mode

- [ ] **Feature files analyzed** (all feature files read)
- [ ] **Step definitions checked** (coverage verified)
- [ ] **Cucumber configuration verified** (config exists and valid)
- [ ] **Services running** (frontend, backend, keycloak)
- [ ] **BDD scenarios executed** (via Cucumber)
- [ ] **Test results analyzed** (passed, failed, pending, skipped)
- [ ] **Bug issues created** (for failed scenarios in implemented features)
- [ ] **Missing step definitions documented** (gaps identified)
- [ ] **Test reports generated** (HTML, JSON, JUnit)
- [ ] **Summary report created** (execution summary)

---

## Cucumber Integration Setup

### If Cucumber Not Configured

**Step 1: Install Dependencies**

```bash
pnpm add -D @cucumber/cucumber @cucumber/pretty-formatter @cucumber/html-formatter
pnpm add -D ts-node @types/node
```

**Step 2: Create Cucumber Config**

```javascript
// cucumber.config.js
export default {
  features: ['tests/e2e/features/**/*.feature'],
  stepDefinitions: ['tests/e2e/step-definitions/**/*.steps.ts'],
  format: [
    '@cucumber/pretty-formatter',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
  ],
  requireModule: ['ts-node/register'],
  worldParameters: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    apiURL: process.env.BACKEND_URL || 'http://localhost:3000',
  },
};
```

**Step 3: Create Step Definition Structure**

```
tests/e2e/step-definitions/
├── common/
│   ├── auth.steps.ts
│   └── navigation.steps.ts
├── customer/
│   ├── customer-management.steps.ts
│   └── customer-rbac.steps.ts
└── [other domains]/
```

**Step 4: Add npm Script**

```json
{
  "scripts": {
    "test:bdd": "cucumber-js --config cucumber.config.js",
    "test:bdd:html": "cucumber-js --config cucumber.config.js && open reports/cucumber-report.html"
  }
}
```

---

## Related Commands

| Command                 | Persona           | Category      | Purpose                               |
| ----------------------- | ----------------- | ------------- | ------------------------------------- |
| `/plan`                 | 📋 Tech Lead      | Planning      | Create backlog from vision            |
| `/groom`                | 📋 Sprint Planner | Planning      | Select sprint scope                   |
| `/implement`            | 🔧 Developer      | Development   | Implement features                    |
| `/bugfix`               | 🔧 Debugger       | Development   | Fix bugs only                         |
| `/audit`                | ✅ Code Auditor   | Quality       | Static analysis & quality             |
| `/browser-test-feature` | ✅ Browser QA     | Quality       | Feature file-based browser testing    |
| `/bdd-test`             | ✅ **BDD Tester** | **Quality**   | **BDD test execution** (this command) |
| `/monkey-test`          | ✅ Exploratory QA | Quality       | Random exploration testing            |
| `/document`             | 📚 Tech Writer    | Documentation | Write documentation                   |

---

## Example Step Definition

**Reference implementation for step definitions:**

```typescript
// tests/e2e/step-definitions/customer/customer-management.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { page } from '../support/world';

Given('I am logged in as a user with role {string}', async function (role: string) {
  // Navigate to login
  await page.goto('/login');

  // Login with role-specific credentials
  const credentials = getCredentialsForRole(role);
  await page.fill('[name="email"]', credentials.email);
  await page.fill('[name="password"]', credentials.password);
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await page.waitForURL('/dashboard');
});

When('I navigate to the customer creation form', async function () {
  await page.goto('/customers/new');
  await page.waitForLoadState('networkidle');
});

When('I fill in customer details:', async function (dataTable: any) {
  const data = dataTable.rowsHash();
  if (data.companyName) {
    await page.fill('[name="companyName"]', data.companyName);
  }
  if (data.vatNumber) {
    await page.fill('[name="vatNumber"]', data.vatNumber);
  }
});

When('I click the {string} button', async function (buttonText: string) {
  await page.click(`button:has-text("${buttonText}")`);
});

Then('I should see a success message {string}', async function (message: string) {
  await expect(page.locator('.toast-success')).toContainText(message);
});

Then('a customer should be created with ID format {string}', async function (format: string) {
  // Extract ID from URL or response
  const customerId = await extractCustomerId();
  expect(customerId).toMatch(new RegExp(format.replace('{uuid}', '[a-f0-9-]+')));
});
```
