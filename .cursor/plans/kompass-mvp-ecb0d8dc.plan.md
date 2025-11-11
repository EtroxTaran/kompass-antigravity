<!-- ecb0d8dc-901c-40fc-a24b-146f60c93655 ccb67c5b-56c0-4f2a-aa4f-220cf5d115ce -->
# KOMPASS MVP Development Plan - Linear User Stories

## Project Structure

Create the following **Epics/Projects** in Linear under team KOM use Linear mcp:

### Phase 0: Infrastructure & DevOps (2-3 weeks)

- Project Setup & Tooling
- Authentication & Authorization Infrastructure
- Database & Sync Infrastructure
- CI/CD Pipeline

### Phase 1: Core CRM - Customer Management (4-5 weeks)

- Customer CRUD Operations
- Location Management
- Contact Management
- Duplicate Detection
- Search & Filtering

### Phase 2: Opportunities (3-4 weeks)

- Opportunity CRUD
- Quote Management
- Status Workflow
- Contact Authority Integration

### Phase 3: Projects (3-4 weeks)

- Project Creation from Opportunities
- Budget & Timeline Management
- Location Assignment
- Project Tracking

### Phase 4: Invoicing & GoBD Compliance (3-4 weeks)

- Invoice Generation
- GoBD Immutability
- Payment Tracking
- Financial Reports

---

## Phase 0: Infrastructure & DevOps

### Epic: Project Setup & Tooling

**Priority:** P0 (Blocker)

**Estimate:** 3 days

**User Story:**

```
As a developer, I need a fully configured monorepo development environment with TypeScript, NestJS backend, React PWA frontend, and shared packages so that I can begin implementing features with proper tooling and code quality standards.
```

**Acceptance Criteria:**

- [ ] pnpm workspace monorepo structure created (`apps/backend/`, `apps/frontend/`, `packages/shared/`)
- [ ] TypeScript strict mode configured for all packages
- [ ] ESLint + Prettier configured with project rules
- [ ] Pre-commit hooks (Husky) enforce linting and type checking
- [ ] Package.json scripts for dev, build, test, lint
- [ ] README with setup instructions

**Subtasks:**

1. Initialize pnpm workspace with turbo.json
2. Configure TypeScript (strict mode, path aliases)
3. Setup ESLint + Prettier with .cursorrules compliance
4. Configure Husky pre-commit hooks
5. Create README.md and CONTRIBUTING.md
6. Setup environment variable validation (zod schemas)

**Documentation Reference:**

- `.cursorrules` - Project structure rules
- `docs/guides/DEVELOPMENT.md`

---

### Epic: Authentication & Authorization Infrastructure

**Priority:** P0 (Blocker)

**Estimate:** 5 days

**User Story:**

```
As a system administrator, I need Keycloak-based authentication with JWT tokens and RBAC enforcement so that users can securely log in with role-based permissions (GF, PLAN, ADM, KALK, BUCH).
```

**Acceptance Criteria:**

- [ ] Keycloak instance deployed (Docker Compose)
- [ ] Keycloak realms configured with KOMPASS roles
- [ ] NestJS JWT authentication guard implemented
- [ ] RBAC guard checks permissions on every endpoint
- [ ] Frontend login flow with JWT token storage (httpOnly cookies)
- [ ] User context available in backend services (@CurrentUser)
- [ ] Role-based route protection in React frontend

**Subtasks:**

1. Setup Keycloak Docker container with realm configuration
2. Create NestJS JwtAuthGuard with Keycloak integration
3. Implement RbacGuard with permission matrix from `RBAC_PERMISSION_MATRIX.md`
4. Create @RequirePermission decorator
5. Implement @CurrentUser decorator for user context
6. Build React login page with Keycloak authentication
7. Setup JWT token storage in httpOnly cookies
8. Create useAuth() hook for frontend auth state
9. Implement protected route wrapper (RequireAuth component)
10. Add role-based UI rendering (useRBAC hook)

**Documentation Reference:**

- `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md`
- `.cursorrules` - Security & Compliance section

---

### Epic: Database & Sync Infrastructure

**Priority:** P0 (Blocker)

**Estimate:** 4 days

**User Story:**

```
As a developer, I need CouchDB for offline-first data storage and PouchDB for client-side sync so that users can work offline and sync data when online.
```

**Acceptance Criteria:**

- [ ] CouchDB Docker container deployed
- [ ] Database schemas for Customer, Location, Contact, Opportunity, Project, Invoice
- [ ] BaseEntity interface implemented in `packages/shared`
- [ ] ID generation utilities (UUID and GoBD sequential)
- [ ] NestJS repository pattern with CouchDB integration
- [ ] PouchDB integration in React frontend
- [ ] Offline sync queue for CREATE/UPDATE/DELETE operations
- [ ] Conflict detection and resolution strategy

**Subtasks:**

1. Setup CouchDB Docker container with security configuration
2. Create BaseEntity interface in `packages/shared/src/types`
3. Implement ID generator utility (`id-generator.ts`)
4. Create repository base class with CouchDB Nano client
5. Setup PouchDB in React app with IndexedDB adapter
6. Implement offline queue service (QueuedChange tracking)
7. Create sync service with conflict detection
8. Build conflict resolution UI component (modal dialog)
9. Add connection status indicator in UI
10. Implement quota management for iOS 50MB limit

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md`
- `.cursorrules` - Offline-First Patterns section

---

### Epic: CI/CD Pipeline

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As a development team, we need automated CI/CD pipelines for testing, building, and deploying KOMPASS so that code quality is enforced and deployments are reliable.
```

**Acceptance Criteria:**

- [ ] GitHub Actions workflow for PR checks (lint, type-check, test)
- [ ] Automated unit test execution (70% of tests)
- [ ] Automated integration test execution (20% of tests)
- [ ] Automated E2E test execution with Playwright (10% of tests)
- [ ] Test coverage reporting (minimum 80%)
- [ ] Docker build and push to registry
- [ ] Deployment scripts for staging and production

**Subtasks:**

1. Create GitHub Actions workflow (`.github/workflows/ci.yml`)
2. Configure Jest for backend unit tests
3. Configure Vitest for frontend unit tests
4. Setup Playwright for E2E tests
5. Configure test coverage thresholds (jest.config.js)
6. Create Docker build workflow
7. Setup staging environment deployment
8. Configure production deployment (manual approval)
9. Add pre-commit vulnerability scanning (pnpm audit)

**Documentation Reference:**

- `docs/specifications/reviews/TEST_STRATEGY_DOCUMENT.md`
- `.cursorrules` - Testing Strategy section

---

## Phase 1: Core CRM - Customer Management

### Epic: Customer CRUD Operations

**Priority:** P0 (Blocker)

**Estimate:** 5 days

**User Story:**

```
As an ADM user, I need to create, view, update, and delete customers with basic company information and billing addresses so that I can manage my customer relationships.
```

**Acceptance Criteria:**

- [ ] Customer entity with BaseEntity fields
- [ ] Customer validation (companyName, vatNumber, email, phone, creditLimit)
- [ ] Customer repository with CouchDB CRUD operations
- [ ] Customer service with business logic and RBAC checks
- [ ] Customer controller with OpenAPI documentation
- [ ] Frontend customer list page (DataTable with shadcn/ui)
- [ ] Frontend customer detail page
- [ ] Frontend customer create/edit form (with validation)
- [ ] ADM users can only view/edit their own customers
- [ ] GF/PLAN can view/edit all customers

**Subtasks:**

1. Create Customer interface in `packages/shared/src/types/entities`
2. Create CreateCustomerDto with class-validator rules
3. Create UpdateCustomerDto and CustomerResponseDto
4. Implement CustomerRepository (CouchDB operations)
5. Implement CustomerService with RBAC checks
6. Create CustomerController with @UseGuards(JwtAuthGuard, RbacGuard)
7. Add OpenAPI documentation (@ApiOperation, @ApiResponse)
8. Build customer list page with shadcn/ui Table
9. Build customer detail page with shadcn/ui Card
10. Build customer form with shadcn/ui Form components
11. Implement useCustomer() hook for data fetching
12. Add unit tests for CustomerService (90% coverage)
13. Add integration tests for Customer API endpoints
14. Add E2E test for customer creation workflow (Playwright)

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Section 2
- `docs/specifications/reviews/API_SPECIFICATION.md` - Section 8
- `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` - Section 4

---

### Epic: Location Management

**Priority:** P0 (Blocker)

**Estimate:** 4 days

**User Story:**

```
As an ADM user, I need to manage multiple delivery locations for my customers so that I can track deliveries to different branches, warehouses, or project sites.
```

**Acceptance Criteria:**

- [ ] Location entity with deliveryAddress and locationType
- [ ] Nested REST API: `/api/v1/customers/{customerId}/locations`
- [ ] Location validation (unique name per customer, required address)
- [ ] Location CRUD operations with parent customer validation
- [ ] Frontend location management tab in customer detail page
- [ ] Location list with filter by locationType and isActive
- [ ] Location create/edit form with address validation
- [ ] Primary contact assignment for locations

**Subtasks:**

1. Create Location interface in `packages/shared`
2. Create CreateLocationDto and UpdateLocationDto with validation
3. Implement LocationRepository
4. Implement LocationService with parent customer validation
5. Create LocationController (nested under CustomerController)
6. Add OpenAPI documentation for location endpoints
7. Build location list component (shadcn/ui Table)
8. Build location form component with address fields
9. Add location tab to customer detail page
10. Implement useLocations() hook
11. Add unit tests for LocationService (90% coverage)
12. Add integration tests for location endpoints
13. Add E2E test for multi-location customer workflow

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Section 3
- `docs/specifications/reviews/API_SPECIFICATION.md` - Section 4
- `.cursorrules` - Nested Resources section

---

### Epic: Contact Management

**Priority:** P0 (Blocker)

**Estimate:** 5 days

**User Story:**

```
As an ADM user, I need to manage contact persons for my customers with decision-making roles and approval authority so that I can track who has purchasing power and influence.
```

**Acceptance Criteria:**

- [ ] Contact entity with decision-making fields (decisionMakingRole, authorityLevel, approvalLimitEur)
- [ ] Contact CRUD operations with RBAC checks
- [ ] Decision authority endpoint: `/api/v1/contacts/{contactId}/decision-authority`
- [ ] Only PLAN and GF can update decision-making roles (Contact.UPDATE_DECISION_ROLE)
- [ ] Validation: approvalLimitEur required if canApproveOrders=true
- [ ] Frontend contact list in customer detail page
- [ ] Contact detail page with decision authority panel
- [ ] Contact form with role-based field restrictions

**Subtasks:**

1. Create ContactPerson interface with DecisionMakingRole enum
2. Create CreateContactDto, UpdateContactDto, UpdateDecisionAuthorityDto
3. Implement ContactRepository
4. Implement ContactService with RBAC decision role checks
5. Create ContactController with decision authority endpoints
6. Add OpenAPI documentation
7. Build contact list component
8. Build contact detail page with decision authority panel
9. Build contact form with conditional fields
10. Restrict decision authority editing to PLAN/GF users (UI)
11. Implement useContact() and useDecisionAuthority() hooks
12. Add unit tests for ContactService (90% coverage)
13. Add integration tests for decision authority endpoints
14. Add E2E test for contact creation with decision roles

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Section 4
- `docs/specifications/reviews/API_SPECIFICATION.md` - Section 5
- `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md` - Section 6

---

### Epic: Duplicate Detection

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As an ADM user, I need the system to warn me when creating a customer that looks like a duplicate (similar name or matching VAT number) so that I don't create duplicate records.
```

**Acceptance Criteria:**

- [ ] Fuzzy matching algorithm for company names (Levenshtein distance)
- [ ] Exact matching for VAT numbers
- [ ] Duplicate detection service checks before customer creation
- [ ] API returns duplicate warning (not error) with potential matches
- [ ] Frontend shows duplicate warning modal with "Create Anyway" option
- [ ] Duplicate detection runs during customer edit (if name/VAT changed)

**Subtasks:**

1. Implement fuzzy matching utility (Levenshtein distance)
2. Create DuplicateDetectionService
3. Add duplicate check in CustomerService.create()
4. Return 200 OK with warning field in response
5. Build duplicate warning modal component (shadcn/ui Dialog)
6. Show list of potential duplicates with similarity score
7. Add "Create Anyway" and "Cancel" buttons
8. Add unit tests for fuzzy matching algorithm
9. Add integration test for duplicate detection API
10. Add E2E test for duplicate warning flow

**Documentation Reference:**

- `.cursorrules` - Domain Model Rules section

---

### Epic: Search & Filtering

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As an ADM user, I need to search and filter customers by name, VAT number, city, rating, and customer type so that I can quickly find specific customers.
```

**Acceptance Criteria:**

- [ ] MeiliSearch integration for full-text search
- [ ] Search API: `GET /api/v1/customers?search=...`
- [ ] Filter API: `?rating=A&customerType=franchise&city=München`
- [ ] Sort API: `?sort=companyName&order=asc`
- [ ] Pagination: `?page=1&limit=20`
- [ ] Frontend search bar with live results (debounced)
- [ ] Frontend filter panel with checkboxes and dropdowns
- [ ] Search performance: < 500ms response time

**Subtasks:**

1. Setup MeiliSearch Docker container
2. Create MeiliSearchService for indexing
3. Index customers on create/update/delete
4. Implement search in CustomerController
5. Add query parameters for filtering and sorting
6. Build search bar component with useDebounce hook
7. Build filter panel component (shadcn/ui Select, Checkbox)
8. Implement pagination controls (shadcn/ui Pagination)
9. Add unit tests for search service
10. Add integration test for search API
11. Add E2E test for search and filter workflow

**Documentation Reference:**

- `.cursorrules` - Performance Optimization section

---

## Phase 2: Opportunities

### Epic: Opportunity CRUD

**Priority:** P0 (Blocker)

**Estimate:** 4 days

**User Story:**

```
As an ADM user, I need to create and manage sales opportunities with estimated values, probabilities, and linked customers so that I can track my sales pipeline.
```

**Acceptance Criteria:**

- [ ] Opportunity entity with status, estimatedValue, probability
- [ ] Status workflow: New → Qualifying → Proposal → Negotiation → Won/Lost
- [ ] Validation: estimatedValue (0-€10M), probability (0-100, increments of 5)
- [ ] Opportunity CRUD operations with RBAC checks
- [ ] Frontend opportunity list page (Kanban board by status)
- [ ] Frontend opportunity detail page
- [ ] Frontend opportunity form with validation

**Subtasks:**

1. Create Opportunity interface with status enum
2. Create CreateOpportunityDto, UpdateOpportunityDto
3. Implement OpportunityRepository
4. Implement OpportunityService with status transition validation
5. Create OpportunityController
6. Build opportunity Kanban board (shadcn/ui Card drag-drop)
7. Build opportunity detail page
8. Build opportunity form
9. Add unit tests (90% coverage)
10. Add integration tests
11. Add E2E test for opportunity lifecycle

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Section 10

---

### Epic: Quote Management

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As an ADM user, I need to create quotes for opportunities with line items and totals so that I can send formal offers to customers.
```

**Acceptance Criteria:**

- [ ] Quote entity with lineItems, subtotal, tax, total
- [ ] Quote linked to Opportunity
- [ ] Quote PDF generation
- [ ] Quote approval workflow (if exceeds contact approval limit)
- [ ] Frontend quote builder with line items
- [ ] PDF preview and download

**Subtasks:**

1. Create Quote interface
2. Implement QuoteService with calculation logic
3. Integrate PDF generation library (e.g., PDFKit)
4. Create QuoteController
5. Build quote builder component (line items table)
6. Add PDF preview modal
7. Add unit tests for quote calculations
8. Add integration tests
9. Add E2E test for quote creation

---

### Epic: Status Workflow

**Priority:** P1 (High)

**Estimate:** 2 days

**User Story:**

```
As an ADM user, I need enforced status transitions for opportunities (e.g., can't skip from "New" to "Won") so that the sales process is followed correctly.
```

**Acceptance Criteria:**

- [ ] Status transition validation in OpportunityService
- [ ] Lost opportunities require lostReason field
- [ ] Won opportunities require actualValue field
- [ ] Frontend status change validates allowed transitions
- [ ] Audit log records status changes

**Subtasks:**

1. Define VALID_TRANSITIONS constant
2. Implement validateStatusTransition() method
3. Add status transition validation to update endpoint
4. Build status dropdown with disabled invalid options
5. Add lostReason modal for "Lost" status
6. Add unit tests for status transitions
7. Add E2E test for status workflow

---

### Epic: Contact Authority Integration

**Priority:** P1 (High)

**Estimate:** 2 days

**User Story:**

```
As a PLAN user, I need the system to warn me if an opportunity value exceeds the contact's approval limit so that I know if higher authority approval is needed.
```

**Acceptance Criteria:**

- [ ] Check opportunity.estimatedValue against contact.approvalLimitEur
- [ ] Display warning if value exceeds limit
- [ ] Suggest contacts with higher approval authority
- [ ] Log approval warnings in audit trail

**Subtasks:**

1. Implement approval limit check in OpportunityService
2. Add warning field to API response
3. Build approval warning banner in opportunity detail page
4. Show suggested approvers list
5. Add unit tests for approval checks
6. Add E2E test for approval warning flow

---

## Phase 3: Projects

### Epic: Project Creation from Opportunities

**Priority:** P0 (Blocker)

**Estimate:** 3 days

**User Story:**

```
As a PLAN user, I need to convert won opportunities into projects with sequential GoBD-compliant project numbers so that I can begin project execution.
```

**Acceptance Criteria:**

- [ ] Project entity with projectNumber (format: P-YYYY-X###)
- [ ] Convert opportunity to project (status must be "Won")
- [ ] Copy contractValue from opportunity.actualValue
- [ ] Assign project manager (must be PLAN user)
- [ ] Frontend "Create Project" button on won opportunities

**Subtasks:**

1. Create Project interface with GoBD fields
2. Implement GoBD project number generation
3. Create ProjectService.createFromOpportunity()
4. Add validation: opportunity.status === "Won"
5. Build project creation wizard
6. Add unit tests
7. Add E2E test for opportunity→project conversion

---

### Epic: Budget & Timeline Management

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As a PLAN user, I need to manage project budgets, timelines, and milestones so that I can track project progress and profitability.
```

**Acceptance Criteria:**

- [ ] Project budget tracking (budget, spent, remaining)
- [ ] Timeline: plannedStartDate, plannedEndDate, actualStartDate, actualEndDate
- [ ] Milestone creation and tracking
- [ ] Budget warning if spent > budget
- [ ] Frontend project dashboard with progress indicators

**Subtasks:**

1. Add budget fields to Project entity
2. Implement budget calculation logic
3. Create Milestone entity
4. Build project dashboard with shadcn/ui Chart
5. Build milestone timeline component
6. Add budget warning alerts
7. Add unit tests
8. Add E2E test

---

### Epic: Location Assignment

**Priority:** P1 (High)

**Estimate:** 2 days

**User Story:**

```
As a PLAN user, I need to assign a customer delivery location to a project so that materials are delivered to the correct site.
```

**Acceptance Criteria:**

- [ ] Project.deliveryLocationId field links to Location entity
- [ ] Validation: location must belong to project's customer
- [ ] Frontend location selector in project form
- [ ] Display delivery address in project detail page

**Subtasks:**

1. Add deliveryLocationId to Project interface
2. Add validation in ProjectService
3. Build location selector dropdown
4. Display delivery address in project detail
5. Add unit tests
6. Add E2E test

---

### Epic: Project Tracking

**Priority:** P1 (High)

**Estimate:** 3 days

**User Story:**

```
As a PLAN user, I need to track project status, phases, and team assignments so that I can monitor project execution.
```

**Acceptance Criteria:**

- [ ] Project status: Planning, In Progress, On Hold, Completed, Cancelled
- [ ] Project phases: Design, Procurement, Execution, Handover
- [ ] Team member assignments
- [ ] Activity log (protocols)

**Subtasks:**

1. Add status and phase fields to Project
2. Implement status workflow validation
3. Create team assignment functionality
4. Build project status board
5. Add activity log component
6. Add unit tests
7. Add E2E test

---

## Phase 4: Invoicing & GoBD Compliance

### Epic: Invoice Generation

**Priority:** P0 (Blocker)

**Estimate:** 4 days

**User Story:**

```
As a BUCH user, I need to generate invoices for projects with sequential GoBD-compliant invoice numbers so that I can bill customers according to German tax regulations.
```

**Acceptance Criteria:**

- [ ] Invoice entity with immutable fields (after finalization)
- [ ] Sequential invoice numbers (format: R-YYYY-#####)
- [ ] Invoice linked to Project and Customer
- [ ] Line items with tax calculations
- [ ] Invoice PDF generation
- [ ] Frontend invoice creation form

**Subtasks:**

1. Create Invoice interface with GoBD immutability fields
2. Implement GoBD invoice number generation
3. Create InvoiceService with tax calculations
4. Implement PDF generation with German invoice format
5. Create InvoiceController
6. Build invoice form with line items table
7. Add invoice PDF preview
8. Add unit tests (90% coverage)
9. Add integration tests
10. Add E2E test for invoice creation

**Documentation Reference:**

- `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md` - Section 10
- `.cursorrules` - GoBD Compliance section

---

### Epic: GoBD Immutability

**Priority:** P0 (Blocker)

**Estimate:** 3 days

**User Story:**

```
As a GF user, I need finalized invoices to be immutable with change logs for corrections so that the system complies with German GoBD tax regulations.
```

**Acceptance Criteria:**

- [ ] Finalized invoices cannot be modified (except by GF with approval)
- [ ] ChangeLog records all corrections
- [ ] Immutable hash (SHA-256) for tamper detection
- [ ] Correction invoices for post-finalization changes
- [ ] Audit trail for all invoice changes

**Subtasks:**

1. Implement immutability checks in InvoiceService
2. Create ChangeLogEntry interface
3. Implement SHA-256 hash generation
4. Add GF-only correction endpoint
5. Create correction invoice functionality
6. Build correction approval modal
7. Add change log display in invoice detail
8. Add unit tests for immutability logic
9. Add integration tests
10. Add E2E test for correction workflow

---

### Epic: Payment Tracking

**Priority:** P1 (High)

**Estimate:** 2 days

**User Story:**

```
As a BUCH user, I need to track invoice payments with dates and amounts so that I can manage accounts receivable.
```

**Acceptance Criteria:**

- [ ] Payment entity linked to Invoice
- [ ] Payment status: Pending, Partial, Paid, Overdue
- [ ] Payment date and amount tracking
- [ ] Invoice status updates based on payments
- [ ] Frontend payment recording form

**Subtasks:**

1. Create Payment interface
2. Implement PaymentService
3. Add payment status calculation logic
4. Build payment recording form
5. Display payment history in invoice detail
6. Add overdue invoice alerts
7. Add unit tests
8. Add E2E test

---

### Epic: Financial Reports

**Priority:** P2 (Medium)

**Estimate:** 3 days

**User Story:**

```
As a GF user, I need financial reports showing revenue, outstanding invoices, and project profitability so that I can make informed business decisions.
```

**Acceptance Criteria:**

- [ ] Revenue report (monthly, quarterly, yearly)
- [ ] Outstanding invoices report
- [ ] Project profitability report (budget vs. actual)
- [ ] Customer revenue ranking
- [ ] Frontend dashboard with charts (shadcn/ui + Recharts)

**Subtasks:**

1. Create ReportService with aggregation queries
2. Implement revenue calculations
3. Implement profitability calculations
4. Create ReportController
5. Build financial dashboard page
6. Add revenue chart (bar chart by month)
7. Add profitability chart (project comparison)
8. Add outstanding invoices table
9. Add unit tests
10. Add E2E test for report generation

---

## Implementation Order & Dependencies

### Critical Path (Must be completed in order):

1. **Phase 0 (Weeks 1-3)**: Infrastructure setup (all epics can be done in parallel)
2. **Phase 1 (Weeks 4-8)**: Core CRM must be completed before Opportunities

                                                                                                                                                                                                                                                                                                                                                                                                - Customer CRUD → Location Management → Contact Management (sequential)
                                                                                                                                                                                                                                                                                                                                                                                                - Duplicate Detection, Search & Filtering (parallel after Customer CRUD)

3. **Phase 2 (Weeks 9-12)**: Opportunities depend on Customers and Contacts

                                                                                                                                                                                                                                                                                                                                                                                                - Opportunity CRUD → Quote Management (sequential)
                                                                                                                                                                                                                                                                                                                                                                                                - Status Workflow, Contact Authority (parallel after Opportunity CRUD)

4. **Phase 3 (Weeks 13-16)**: Projects depend on Opportunities

                                                                                                                                                                                                                                                                                                                                                                                                - Project Creation → Budget & Timeline → Location Assignment → Tracking (sequential)

5. **Phase 4 (Weeks 17-20)**: Invoicing depends on Projects

                                                                                                                                                                                                                                                                                                                                                                                                - Invoice Generation → GoBD Immutability (sequential)
                                                                                                                                                                                                                                                                                                                                                                                                - Payment Tracking, Financial Reports (parallel after Invoice Generation)

### Parallel Work Opportunities:

- **Infrastructure**: All Phase 0 epics can start simultaneously
- **After Customer CRUD**: Duplicate Detection and Search can be done in parallel with Location/Contact
- **After Opportunity CRUD**: Quote, Status Workflow, and Contact Authority can be done in parallel
- **After Invoice Generation**: Payment Tracking and Financial Reports can be done in parallel

---

## Linear Project Setup Commands

Create these projects/milestones in Linear:

```
Project: KOMPASS MVP - Phase 0: Infrastructure
 - Epic: Project Setup & Tooling
 - Epic: Authentication & Authorization Infrastructure
 - Epic: Database & Sync Infrastructure
 - Epic: CI/CD Pipeline

Project: KOMPASS MVP - Phase 1: Core CRM
 - Epic: Customer CRUD Operations
 - Epic: Location Management
 - Epic: Contact Management
 - Epic: Duplicate Detection
 - Epic: Search & Filtering

Project: KOMPASS MVP - Phase 2: Opportunities
 - Epic: Opportunity CRUD
 - Epic: Quote Management
 - Epic: Status Workflow
 - Epic: Contact Authority Integration

Project: KOMPASS MVP - Phase 3: Projects
 - Epic: Project Creation from Opportunities
 - Epic: Budget & Timeline Management
 - Epic: Location Assignment
 - Epic: Project Tracking

Project: KOMPASS MVP - Phase 4: Invoicing & GoBD
 - Epic: Invoice Generation
 - Epic: GoBD Immutability
 - Epic: Payment Tracking
 - Epic: Financial Reports
```

---

## Testing Requirements (70/20/10 Pyramid)

For each epic, ensure:

- **70% Unit Tests**: All services, utilities, and validation logic
                                                                                                                                                                                                                                                                - Target: 90% coverage for business logic (services)
                                                                                                                                                                                                                                                                - Target: 85% coverage for shared utilities
- **20% Integration Tests**: API endpoints with real database
                                                                                                                                                                                                                                                                - All CRUD operations
                                                                                                                                                                                                                                                                - Permission checks
                                                                                                                                                                                                                                                                - Business rule validation
- **10% E2E Tests**: Complete user workflows with Playwright
                                                                                                                                                                                                                                                                - Happy path scenarios
                                                                                                                                                                                                                                                                - Critical error scenarios

---

## Documentation References

- **Data Model**: `docs/specifications/reviews/DATA_MODEL_SPECIFICATION.md`
- **API Design**: `docs/specifications/reviews/API_SPECIFICATION.md`
- **RBAC**: `docs/specifications/reviews/RBAC_PERMISSION_MATRIX.md`
- **Testing**: `docs/specifications/reviews/TEST_STRATEGY_DOCUMENT.md`
- **Rules**: `.cursorrules` (all sections)

---

## Estimated Timeline

- **Phase 0**: 2-3 weeks (infrastructure)
- **Phase 1**: 4-5 weeks (core CRM)
- **Phase 2**: 3-4 weeks (opportunities)
- **Phase 3**: 3-4 weeks (projects)
- **Phase 4**: 3-4 weeks (invoicing)

**Total MVP Delivery**: ~18-20 weeks (4.5-5 months) for full-time team

---

## Next Steps

1. Create Linear projects/epics as outlined above
2. Import user stories into Linear with acceptance criteria and subtasks
3. Assign team members to epics based on expertise
4. Begin Phase 0: Infrastructure setup
5. Review this plan with stakeholders for feedback

### To-dos

- [ ] Create 5 Linear projects for each phase (Phase 0-4) in team COD workspace
- [ ] Import Phase 0 epics into Linear with acceptance criteria and subtasks (4 epics: Project Setup, Auth, Database, CI/CD)
- [ ] Import Phase 1 epics into Linear with acceptance criteria and subtasks (5 epics: Customer CRUD, Location, Contact, Duplicate, Search)
- [ ] Import Phase 2 epics into Linear with acceptance criteria and subtasks (4 epics: Opportunity CRUD, Quote, Status Workflow, Contact Authority)
- [ ] Import Phase 3 epics into Linear with acceptance criteria and subtasks (4 epics: Project Creation, Budget, Location Assignment, Tracking)
- [ ] Import Phase 4 epics into Linear with acceptance criteria and subtasks (4 epics: Invoice Generation, GoBD Immutability, Payment, Reports)
- [ ] Schedule review meeting with stakeholders to validate plan and get feedback on priorities
- [ ] Assign team members to Phase 0 epics based on expertise (backend, frontend, devops)