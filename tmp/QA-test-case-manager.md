# Prompt: Generate BDD Test Cases for KOMPASS Project

## Documentation

## Objective

You are an AI coding agent tasked with generating **Behavior-Driven Development (BDD)** style test cases from the KOMPASS project's documentation. The goal is to produce comprehensive user-story test scenarios (in Gherkin syntax) that cover **all features and requirements** described in the product vision, personas, and specifications. These test scenarios will serve as acceptance tests for the front-end UI and API, ensuring that a tester can verify if all features are implemented correctly.

## Context

```
The KOMPASS project documentation is contained in a docs/ folder with multiple Markdown files and subfolders:
- docs/personas/ - User persona definitions (GF, ADM, INNEN, PLAN, BUCH, KALK, Marketing)
- docs/product-vision/ - Product vision documents and feature specifications
- docs/specifications/ - Technical specifications:
  - api-specification.md - REST API endpoints and contracts
  - rbac-permissions.md - Role-based access control matrix
  - data-model.md - Entity structures and relationships
  - test-strategy.md - Test pyramid (70/20/10), coverage targets, test patterns
  - nfr-specification.md - Non-functional requirements

All files are in Markdown format.

Personas: The docs describe various user personas (GF, ADM, INNEN, PLAN, BUCH, KALK) along with their goals, needs, and interactions with the application. Each persona maps to an RBAC role.

Product Vision & Features: The docs outline the application's features, functionalities, and intended user capabilities. This includes:
- Customer Management (with multi-location support)
- Opportunity Management
- Project Management
- Location Management (nested under Customer)
- Contact Management (with decision authority)
- Offline-first synchronization
- RBAC permission enforcement
- GoBD compliance (immutability, audit trails)
- Calendar and time tracking (Phase 1 MVP)

Every feature or user action mentioned in the documentation should be considered.
```

## Task Overview

Your task is to **read and analyze the entire KOMPASS project documentation** and then generate BDD test cases that cover every aspect of the described system behavior. Specifically, you will:

1. **Read all documentation files** in the docs directory (including subfolders). Gather information on:
   - All **user personas** and their roles/goals (from `docs/personas/`)
   - All **features, functionalities, and user actions** the application is supposed to support (as described in `docs/product-vision/`, `docs/specifications/`)
   - **RBAC permissions** and role-based access patterns (from `docs/specifications/rbac-permissions.md`)
   - **API endpoints** and contracts (from `docs/specifications/api-specification.md`)
   - **Test strategy** and existing test patterns (from `docs/specifications/test-strategy.md`)
   - Any stated **acceptance criteria** or examples in the docs

2. **Identify key features and behaviors** from the docs. For each feature or requirement (for example: customer creation, location assignment, offline sync, RBAC permission checks, GoBD immutability, etc.), determine how a user (possibly a specific persona) would interact with that feature.

3. **Generate BDD scenarios** (in Given/When/Then format) for each identified behavior. Ensure **all personas and features are covered**:
   - For each **persona**, include scenarios that cover the actions that persona can perform and their expected outcomes. Use persona tags: `@persona:GF`, `@persona:ADM`, `@persona:INNEN`, `@persona:PLAN`, `@persona:BUCH`, `@persona:KALK`
   - For each **feature** or use-case, write scenarios covering normal usage as well as edge conditions (see below)
   - Include **offline-first scenarios**: offline data entry, conflict detection, conflict resolution, sync workflows
   - Include **RBAC scenarios**: permission checks, role-based access, unauthorized access attempts, record-level permissions
   - Include **GoBD compliance scenarios**: immutability after finalization, audit trails, change logs, correction workflows
   - Include **nested resource scenarios**: Location under Customer, Contact Decision Authority patterns
   - Include **multi-location customer scenarios**: location assignment, delivery location selection, primary contact assignment

4. **Organize the test cases logically** into **feature-based structure** (NOT persona-based):
   - **Feature-based grouping**: Group scenarios by business capability/domain:
     - `customer/` - Customer management scenarios
     - `location/` - Location management scenarios (nested under Customer)
     - `contact/` - Contact management scenarios
     - `opportunity/` - Opportunity management scenarios
     - `project/` - Project management scenarios
     - `offline/` - Offline sync and conflict resolution scenarios
     - `rbac/` - RBAC permission and access control scenarios
     - `gobd/` - GoBD compliance scenarios (immutability, audit trails)
     - `calendar/` - Calendar and time tracking scenarios (Phase 1 MVP)
   - Include persona context in scenario descriptions (e.g., "Given ADM user is logged in")
   - Use tags for persona filtering: `@persona:ADM`, `@persona:GF`, etc.
   - Use tags for test types: `@e2e`, `@integration`, `@unit`
   - Use tags for features: `@offline`, `@rbac`, `@gobd`, `@nested-resource`

5. **Do not output any analysis or commentary** on the docs content. Only output the final test cases in the specified format.

## KOMPASS Project Structure

### Test File Locations

- **E2E Tests**: `tests/e2e/features/{domain}/` - Feature files in Gherkin format (`.feature` extension)
- **Step Definitions**: `tests/e2e/steps/{domain}/` - Playwright step definitions organized by domain
- **Integration Tests**: `tests/integration/{domain}/` - API integration tests
- **Unit Tests**: Colocated with source files (`*.spec.ts`)

### Test Strategy Alignment

KOMPASS follows a **70/20/10 test pyramid**:

- **70% Unit Tests** - Fast, isolated tests of business logic
- **20% Integration Tests** - API and database integration tests
- **10% E2E Tests** - End-to-end user workflows with Playwright

**Coverage Targets:**

- Overall: 80% minimum
- Business logic (services): 90% minimum
- React components: 80% minimum

**Reference:** `docs/specifications/test-strategy.md`

### Test File Naming

- **E2E Feature Files**: `{feature-name}.feature` (Gherkin format)
- **E2E Step Definitions**: `{domain}.steps.ts` (Playwright + Cucumber)
- **Integration Tests**: `{entity}-{operation}.integration.spec.ts`
- **Unit Tests**: `{entity}.{layer}.spec.ts` (colocated with source)

### Test ID Conventions

Use test IDs for traceability:

- **E2E Tests**: `E2E-{DOMAIN}-###` (e.g., `E2E-CUST-001`, `E2E-LOC-002`)
- **Integration Tests**: `INT-{DOMAIN}-###` (e.g., `INT-DEC-001`)
- **Unit Tests**: `UNIT-{DOMAIN}-###` (e.g., `UNIT-CUST-001`)

## Best Practices for BDD Test Cases

When writing the scenarios, adhere to BDD and Gherkin best practices for clarity and effectiveness:

```
One Behavior per Scenario: Each scenario should focus on a single distinct behavior or acceptance criterion. Avoid combining multiple unrelated actions or outcomes in one scenario. In other words, one scenario = one user story or use-case result.

Given/When/Then Syntax: Follow the Gherkin structure strictly – start with context (Given), then the action (When), then the outcome (Then). Use And to continue a Given, When, or Then block if multiple steps are needed. Do not repeat the When-Then sequence in a single scenario; start a new scenario for each new When-Then pair.

Clear, Concise Language: Write in simple, business-readable language (English) so that anyone, even without technical knowledge of the feature, can understand the scenario. Avoid technical jargon or internal implementation details – describe interactions and outcomes from the user's perspective. (For example, prefer "the user clicks the Delete button and sees a confirmation message" over "an API call returns status 200".)

German UI Labels: Since KOMPASS uses German language UI, include German labels and error messages in scenarios where appropriate. For example: "Then an error message 'Firmenname ist erforderlich' is displayed" or "When the user clicks 'Kunde speichern' button".

Descriptive Titles: Begin each scenario with a short Scenario title that summarizes the behavior being tested. For example: Scenario: ADM user creates customer with valid data or Scenario: Offline customer creation syncs when connection restored. A good title makes it easy to understand the intent at a glance.

Ensure Readability: Remember the Golden Gherkin Rule – treat the reader as you would want to be treated; write scenarios so that someone unfamiliar with the feature will still understand what's happening. Scenarios double as documentation of requirements, so clarity is paramount.

Single Responsibility: Keep scenarios granular and independent. Each scenario should ideally be executable on its own (tests shouldn't depend on running other scenarios first). If scenarios share the same setup, you can use a Gherkin Background section for common Given steps to avoid repetition.

Use Realistic Data (but Generic): Where example data is needed (e.g., form inputs, user names), use realistic but generic values (e.g., "Hofladen Müller GmbH" for a company name, "DE123456789" for a VAT number) so that the scenario is easy to follow. Avoid overly specific or fictional data that might confuse.

Scenario Outlines for Variations: If a scenario needs to be tested with multiple input variations (for example, different invalid input values), you can use Scenario Outline with an Examples table for brevity. This avoids writing very similar scenarios multiple times, but use this only when it improves clarity.

Playwright Integration: When generating E2E scenarios, ensure they can be implemented with Playwright. Use declarative language (what the user sees/does) rather than imperative (how to click/type). Step definitions should use Playwright API (page.goto(), page.click(), page.fill(), etc.).
```

## Coverage Requirements

To ensure the test suite is exhaustive and covers everything described in the docs, include the following:

```
All Features and Actions: Every feature or action mentioned in the product vision or persona descriptions must have at least one scenario. This includes basic CRUD actions (create/read/update/delete) for any core entities, navigation flows, settings configuration, search or filter functionalities, etc., as applicable. For instance, if the product vision says users can create a customer, assign locations, manage contacts, or create opportunities, each of those should be translated into one or more scenarios.

Persona-specific Behaviors: For each persona, cover their unique goals and behaviors. If a persona has particular permissions or tasks (e.g., ADM can only manage their own customers, GF can manage all customers), ensure those scenarios are included. Use the persona's role in the scenario context to make it clear (e.g., Given ADM user is logged in ...).

Positive and Negative Flows: For each feature, write scenarios for the normal expected behavior (the "happy path") as well as edge cases or error conditions. This means including:
- Valid input scenario(s): when a user does everything correctly, they achieve the expected result (e.g., form submission succeeds with valid data).
- Validation error scenario(s): when a user makes a mistake or inputs invalid data, the system should respond with appropriate error messages or behavior. For example, attempting to submit a form with required fields empty, or inputting an invalid VAT number format, should yield a clear error message (in German).
- Edge case scenario(s): cover any unusual or extreme cases mentioned in docs (or reasonably expected). For instance, what happens if an optional field is at maximum length, or if an operation is performed when there is no data, etc. Consider boundary values (minimum/maximum inputs) and unusual user actions.
- Unauthorized/negative scenarios: if applicable, scenarios where a user tries to do something they are not allowed to (e.g., ADM attempting to access another ADM's customer, or INNEN trying to finalize an invoice) and ensure the system prevents it (e.g., shows an access denied message or returns 403 Forbidden).

Offline-First Scenarios: Include comprehensive offline scenarios:
- Offline data entry: creating/updating entities while offline
- Conflict detection: detecting conflicts when syncing offline changes
- Conflict resolution: resolving conflicts (automatic and manual)
- Sync workflows: successful sync, failed sync, partial sync
- Offline indicators: UI showing offline status, pending changes count
- Quota management: storage quota warnings and limits (iOS 50MB limit)

RBAC Scenarios: Include permission and access control scenarios:
- Entity-level permissions: CREATE, READ, UPDATE, DELETE permissions per role
- Record-level permissions: ADM can only access own customers, GF/PLAN can access all
- Permission denial: unauthorized access attempts return 403 Forbidden
- Role-based UI: UI elements hidden/shown based on permissions
- Permission escalation: attempts to bypass permissions are prevented

GoBD Compliance Scenarios: Include immutability and audit trail scenarios:
- Immutability after finalization: finalized invoices cannot be modified
- Audit trail: all changes logged with user, timestamp, reason
- Change log: corrections require GF approval and reason
- Immutable hash: tamper detection for finalized records
- Correction workflows: creating correction invoices instead of modifying finalized ones

Nested Resource Scenarios: Include scenarios for nested REST resources:
- Location under Customer: creating/updating locations via nested routes
- Parent validation: verifying parent customer exists before child operations
- Child ownership: verifying location belongs to customer
- RBAC cascading: permissions cascade from parent to child

Multi-Location Customer Scenarios: Include scenarios for multi-location customers:
- Location assignment: assigning multiple locations to customer
- Default delivery location: selecting default delivery location
- Primary contact per location: assigning primary contact for each location
- Location uniqueness: location name unique within customer (not globally)

Complete Acceptance Criteria: If the documentation includes explicit acceptance criteria or examples for a feature, make sure each of those is translated into at least one scenario. The test cases should collectively satisfy all acceptance criteria listed in the docs for each user story/feature.
```

Including **edge cases and examples is crucial for comprehensive coverage**. By covering different inputs and situations, we improve the reliability and thoroughness of the test suite. However, ensure that even edge case scenarios remain focused and not overly complicated – if an edge case involves a completely different behavior, isolate it in its own scenario.

## Edge Cases and Validation

For clarity, here are guidelines on covering edge cases and validations in the scenarios:

```
Required Field Validation: If the app has forms or inputs, include scenarios such as: When the user leaves a required field blank and submits, then a validation error message is shown (in German) and the form is not accepted.

Invalid Format/Input: For any inputs with format rules (email, VAT number, phone number, etc.), include scenarios for invalid input. e.g., When the user enters an invalid VAT number (not DE followed by 9 digits), then an error "Umsatzsteuer-ID muss das Format DE123456789 haben" is displayed. Cover other invalid cases like forbidden characters, too short/too long input, etc., especially if the docs mention specific rules (see domain-model.mdc for validation rules).

Boundary Values: If numbers or ranges are involved (e.g., character limits, quantity ranges), test the boundaries. For example: When the user enters a company name of 1 character (below the minimum length of 2), then a specific error is shown. Similarly test maximum allowed length + 1, etc.

No Data / Empty States: Include scenarios for actions when no data is present. For example, If a user tries to view a customer list but there are no customers, the application should show a "Keine Kunden gefunden" message rather than crash or hang.

Concurrent or Unusual Actions: Consider if any concurrent action or rare situation is described (or likely). For example, if two users might interact (one creates a customer, another views it), or if the user refreshes the page mid-action – include a scenario if relevant.

Offline Conflict Scenarios: Include scenarios for:
- Concurrent offline edits: two users edit same record offline, then sync
- Conflict detection: system detects field-level conflicts
- Automatic resolution: last-write-wins for non-critical fields
- Manual resolution: user chooses which version to keep for critical fields
- Conflict UI: user sees conflict resolution dialog with both versions

RBAC Edge Cases: Include scenarios for:
- Permission boundary testing: user with partial permissions
- Role switching: user with multiple roles
- Permission inheritance: GF inherits all permissions
- Record ownership: ADM accessing another ADM's customer

GoBD Edge Cases: Include scenarios for:
- Finalization workflow: invoice becomes immutable after finalization
- Correction approval: GF approval required for corrections
- Change log completeness: all changes logged with required fields
- Hash verification: immutable hash detects tampering attempts

Each edge case scenario should still follow the Given/When/Then format and clearly state the expected outcome (usually an error message in German or safe failure state). This ensures that testers can verify the system handles the scenario gracefully.
```

## Accessibility Test Scenarios

Ensure the test suite also covers basic **accessibility** requirements of the application. Accessibility scenarios should verify that users with disabilities (or using assistive tools) can use the application effectively. Even if the documentation does not explicitly mention accessibility, include general test cases for it (as it's an important aspect of front-end quality):

```
Keyboard Navigation: Scenarios to ensure that all interactive elements are reachable and usable via keyboard alone (e.g., Given a user is on page X, when they press the "Tab" key to navigate, then focus moves sequentially through interactive elements). For example, include a "Skip to content" link scenario: Given the user is on the homepage, When they select the "Skip to content" link (pressing Enter on it), Then the main page content receives keyboard focus (meaning keyboard users can bypass navigation menus).

Screen Reader / Alt Text: Scenarios to verify that important UI elements have text alternatives. For instance: When a screen reader is used on a page with images, Then each image has an appropriate alt text description announced. Or Given a form is displayed, When using assistive technology, Then every form field has an associated label or aria-label. These ensure visually impaired users can perceive the content.

Color and Contrast: If the product vision mentions themes or design, include a scenario like: When the user enables high-contrast mode (or if they use the site in grayscale), Then all text is still readable and icons have sufficient contrast. (This can be more of a visual check, but you can state it as an expectation to be manually verified.)

Focus Management: Scenarios ensuring that when modals or pop-ups appear, focus is trapped within the modal and returns to a sensible place after closing. For example: Given a modal dialog is opened, When the user presses Tab, Then the focus cycles through elements in the modal (and does not go behind the modal). Or When the modal is closed, Then focus returns to the button that opened it. Such scenarios ensure accessibility for keyboard and screen reader users.

Mobile Accessibility: Since KOMPASS is a mobile-first PWA (especially for ADM persona), include scenarios for:
- Touch target sizes: All interactive elements are at least 44x44 pixels (iOS HIG requirement)
- Mobile screen reader: VoiceOver/TalkBack compatibility
- Mobile keyboard: Proper input types and keyboard layouts
- Mobile gestures: Swipe, pinch, long-press gestures work correctly

Other Accessibility Features: If any specific features are in the docs (like keyboard shortcuts, ARIA landmarks/roles, captioning for videos, etc.), include scenarios for those. For example, if the app includes video content, Given a user is watching a video, When they turn on captions, Then captions are displayed in sync with the audio.
```

The above accessibility scenarios can be grouped together (potentially under a feature file like "Accessibility Compliance") or placed under relevant feature files (e.g., form-related accessibility tests alongside form feature scenarios). The key is to **explicitly cover accessibility acceptance criteria** so that testers will remember to verify them.

## Playwright Integration

When generating E2E test scenarios, ensure they are compatible with Playwright automation:

```
Step Definitions: Scenarios should be written so they can be implemented with Playwright step definitions. Use declarative language (what the user sees/does) rather than imperative (how to click/type).

Example Playwright Step Definitions:
- Given steps: Setup (login, navigate, create test data)
- When steps: User actions (click, fill, submit)
- Then steps: Assertions (expect, verify, check)

Playwright API Usage: Step definitions should use Playwright API:
- page.goto(url) - Navigation
- page.click(selector) - Click actions
- page.fill(selector, value) - Form inputs
- page.selectOption(selector, value) - Dropdowns
- page.waitForSelector(selector) - Wait for elements
- expect(page.locator(selector)).toBeVisible() - Assertions
- expect(page.locator(selector)).toContainText(text) - Text assertions

Fixtures: Use Playwright fixtures for:
- Authenticated sessions: Login once, reuse session
- Test data: Create test customers, locations, contacts
- Cleanup: Delete test data after tests

Page Object Model (Optional): For complex pages, consider Page Object Model pattern, but prefer functional helpers for simplicity.

Mobile Testing: Include mobile viewport scenarios for ADM persona (mobile-first workflow):
- Use mobile viewport sizes (375x667 for iPhone, 360x640 for Android)
- Test touch interactions (tap, swipe, long-press)
- Test mobile-specific UI (bottom navigation, mobile menus)
```

**Reference:** `playwright.config.ts` for Playwright configuration and viewport settings.

## Output Format

Finally, format the output as **Gherkin feature files** containing the test scenarios:

````
Feature Files: Each feature file should represent a feature suite (group of related scenarios). Place feature files in tests/e2e/features/{domain}/ directory with .feature extension.

Start each file with a Feature: ... line indicating the feature or domain. For example:
Feature: Customer Management
Feature: Location Management (Nested under Customer)
Feature: Offline Synchronization
Feature: RBAC Permission Enforcement

Below that, list the scenarios. Group scenarios by business capability/domain, not by persona. Include persona context in scenario descriptions and use tags.

Scenarios: Use Gherkin syntax for each scenario:
- Begin with Scenario: (or Scenario Outline: if using outlines for multiple examples) followed by a descriptive title.
- Include test ID in scenario title or as a tag: @E2E-CUST-001
- Include persona tags: @persona:ADM, @persona:GF, etc.
- Include feature tags: @offline, @rbac, @gobd, @nested-resource
- Include test type tags: @e2e, @integration, @unit
- Then list the steps starting with Given, When, Then, and use And for additional steps of the same type. Indent the step lines with 2 spaces for readability.

Example formatting within a file:
```gherkin
Feature: Customer Management

  Background:
    Given the application is running
    And the database is seeded with test data

  @E2E-CUST-001 @persona:ADM @e2e
  Scenario: ADM user creates customer with valid data
    Given ADM user "Max Mustermann" is logged in
    And the user navigates to "/customers"
    When the user clicks "Neuer Kunde" button
    And the user fills in "Firmenname" with "Hofladen Müller GmbH"
    And the user fills in "Umsatzsteuer-ID" with "DE123456789"
    And the user fills in "Straße" with "Hauptstraße 15"
    And the user fills in "Postleitzahl" with "80331"
    And the user fills in "Stadt" with "München"
    And the user clicks "Speichern" button
    Then a new customer "Hofladen Müller GmbH" is created
    And the user is redirected to the customer detail page
    And a success message "Kunde erfolgreich erstellt" is displayed

  @E2E-CUST-002 @persona:ADM @e2e
  Scenario: ADM user cannot create customer with invalid VAT number
    Given ADM user "Max Mustermann" is logged in
    And the user navigates to "/customers"
    When the user clicks "Neuer Kunde" button
    And the user fills in "Firmenname" with "Test GmbH"
    And the user fills in "Umsatzsteuer-ID" with "INVALID"
    And the user clicks "Speichern" button
    Then the customer is not created
    And an error message "Umsatzsteuer-ID muss das Format DE123456789 haben" is displayed below "Umsatzsteuer-ID" field
````

Multiple Files: Because there will be many scenarios, output them in multiple feature files organized by domain:

- tests/e2e/features/customer/customer-management.feature
- tests/e2e/features/location/location-management.feature
- tests/e2e/features/contact/contact-management.feature
- tests/e2e/features/offline/offline-sync.feature
- tests/e2e/features/rbac/rbac-permissions.feature
- tests/e2e/features/gobd/gobd-compliance.feature

No Extra Commentary: The feature files should contain only the Feature and Scenario definitions. Do not include explanatory text or analysis in the output files. The final user (tester) should be able to take these Gherkin feature files as-is and implement Playwright step definitions to automate them.

```

## Step Definitions Structure

When generating scenarios, consider how they will be implemented with Playwright step definitions:

```

Step Definition Organization: Organize step definitions in tests/e2e/steps/{domain}/ directory:

- tests/e2e/steps/customer/customer.steps.ts
- tests/e2e/steps/location/location.steps.ts
- tests/e2e/steps/offline/offline.steps.ts
- tests/e2e/steps/rbac/rbac.steps.ts

Reusable Steps: Use Background sections for common setup steps:

- User authentication
- Navigation to pages
- Test data creation

Step Definition Patterns: Write scenarios so step definitions can use:

- Playwright page API for interactions
- Test fixtures for authentication and test data
- Helper functions for complex operations
- Assertions using Playwright expect API

```

## Execution

Perform the steps to parse the docs and generate the test cases. **Double-check** that every feature and persona from the documentation is covered by some scenario. Include robust scenarios following the guidelines above (edge cases, validation, accessibility, offline-first, RBAC, GoBD). Once done, output the Gherkin feature files as described.

By following these instructions, you will produce a set of well-structured BDD test cases that serve as a complete test suite for the KOMPASS application. These tests will be human-readable and cover all functional requirements (from the perspective of various personas), including edge cases, accessibility, offline-first workflows, RBAC permissions, and GoBD compliance, in a Given/When/Then format consistent with best practices. Ensure the output is neatly formatted in Gherkin syntax for easy reading and Playwright automation.

## References

- **Test Strategy**: `docs/specifications/test-strategy.md` - 70/20/10 pyramid, coverage targets, test patterns
- **RBAC Permissions**: `docs/specifications/rbac-permissions.md` - Role-based access control matrix
- **API Specification**: `docs/specifications/api-specification.md` - REST API endpoints and contracts
- **Personas**: `docs/personas/README.md` - User persona definitions and workflows
- **Product Vision**: `docs/product-vision/README.md` - Product strategy and feature specifications
- **Domain Model**: `.cursor/rules/domain-model.mdc` - Entity validation rules and business logic
- **Test Strategy Examples**: `docs/specifications/test-strategy.md` - Existing test patterns and examples
- **Playwright Config**: `playwright.config.ts` - Playwright configuration and viewport settings

## BDD Best Practices Resources

- BDD 101: Writing Good Gherkin | Automation Panda
  https://automationpanda.com/2017/01/30/bdd-101-writing-good-gherkin/

- A Guide to Implementing BDD Automation - TestRail
  https://www.testrail.com/blog/bdd-automation/

- Using Gherkin To Write Accessibility Tests - Hassell Inclusion
  https://www.hassellinclusion.com/blog/gherkin-accessibility-tests/
```
