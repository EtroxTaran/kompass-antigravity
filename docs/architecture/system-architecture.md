# KOMPASS System Architecture

**Version**: Current  
**Last Updated**: 2025-01-28  
**Status**: ✅ Active Implementation Reference  
**Authors**: Architecture Team

**Purpose**: Complete technical architecture for KOMPASS integrated CRM & Project Management system  
**Scope**: MVP foundation with clear evolution path to advanced features

---

## Executive Summary

KOMPASS is an **integrated CRM and Project Management system** designed as an **offline-first PWA** for mid-market project-based businesses. The architecture balances **pragmatic MVP delivery** with **comprehensive long-term vision**, ensuring reliable foundation while enabling sophisticated future capabilities.

### Core Architecture Principles

1. **Offline-First**: Seamless operation without internet connectivity
2. **Compliance-by-Design**: GoBD and DSGVO compliance built into core architecture
3. **Incremental Evolution**: Phased approach from MVP to full intelligent automation
4. **Risk-Mitigated**: Pragmatic decisions based on team size and timeline constraints
5. **Self-Hosted**: Open-source components, no vendor lock-in, full data control

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         KOMPASS Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌───────────────┐                          ┌───────────────┐       │
│  │   Frontend    │◀────REST API + WS───────▶│   Backend     │       │
│  │   (React)     │     JSON over HTTPS      │   (NestJS)    │       │
│  └───────┬───────┘                          └───────┬───────┘       │
│          │                                          │               │
│          │ PouchDB Sync                             │ CouchDB API   │
│          ▼                                          ▼               │
│  ┌───────────────┐                          ┌───────────────┐       │
│  │   PouchDB     │◀────Bi-Directional──────▶│   CouchDB     │       │
│  │ (IndexedDB)   │     Replication          │  (Primary DB) │       │
│  └───────────────┘                          └───────┬───────┘       │
│                                                      │               │
│          ┌───────────────────────────────────────────┼───────────┐   │
│          │                                           │           │   │
│          ▼                   ▼                       ▼           ▼   │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐ ┌─────────┐│
│  │ MeiliSearch │    │    n8n      │    │  Keycloak    │ │ Grafana ││
│  │  (Search)   │    │(Automation) │    │   (Auth)     │ │(Monitor)││
│  └─────────────┘    └─────────────┘    └──────────────┘ └─────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### AI Proxy Service

- **Role**: Sole AI entrypoint that standardizes HTTP/WS contracts for prompts, tool-calls, and streaming responses.
- **Implementation Reference**: Detailed deployment, sizing, and operational patterns live in the [AI Extensions Implementation Guide](./ai-extensions/AI_Automation_Extensions_Implementation_Guide.md); use it alongside this section when enabling Phase 2 features.
- **Boundary**: All AI traffic uses `/api/ai/*` paths over HTTPS or WebSocket; responses use a unified envelope (request id, status, payload, error) and explicit streaming events for partial tokens.
- **Routing**: API gateway performs path-based forwarding for `/api/ai/*` to the AI Proxy; other backend routes remain untouched.
- **Provider selection**:
  - **n8n workflows** (default for orchestrations and retrieval-augmented flows) enabled via `AI_PROVIDER=n8n`.
  - **OpenAI** (managed SaaS) enabled via `AI_PROVIDER=openai` with API key/endpoint variables.
  - **Self-hosted LLM** (e.g., local Ollama/Inference server) enabled via `AI_PROVIDER=self_hosted` and provider-specific host flags.
- **Data classification, routing, and policy enforcement**
  - **Classification levels** (applied per-request by caller + validated by proxy policy engine):
    - **Public**: marketing copy, generic FAQs, non-customer content.
    - **Internal**: non-personal operational data, playbooks, product docs.
    - **Customer**: identifiable customer/project data without special regulatory flags.
    - **Sensitive/Regulated**: personal data subject to GDPR/DSGVO or contractually restricted data.
  - **Allowed providers by classification**:
    | Classification        | Allowed Providers                            | Consent Requirement               | Logging & Retention                               | Explicit Opt-Out Paths                                        |
    | -------------------- | -------------------------------------------- | --------------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
    | **Public**           | n8n, Self-Hosted, OpenAI                     | None                              | Standard request/response logs (30d)             | Tenant/org setting `ai.optOut.public=false` to disable class  |
    | **Internal**         | n8n, Self-Hosted (default); OpenAI fallback* | None                              | Standard logs + prompt/result hashing (90d)      | Tenant flag `ai.optOut.internal=true` forces self-hosted only |
    | **Customer**         | n8n, Self-Hosted; OpenAI fallback*           | Contractual consent (per-tenant)  | Full audit trail + content hashing (180d)        | Per-tenant `ai.providers.customer=openai_disabled`            |
    | **Sensitive/Regulated** | Self-Hosted only (default); n8n if private-runner | Explicit customer consent + DPA   | Full audit, redaction proof, retention 365d+ per DPA | `AI_PROVIDER_OVERRIDE=forbid_openai`, policy flag `strictNoFallback=true` |
  - **Consent handling**: Proxy enforces tenant-level consent flags; requests without required consent are rejected with `HTTP 412 Precondition Failed` and a machine-readable error code.
  - **Logging**: All routes produce structured audit records (classification, provider, model, latency, billing tokens). Sensitive/Regulated requests additionally store redaction fingerprints and purpose-of-use codes.
- **Fallback logic**
  - **Default path**: Proxy uses configured primary (typically n8n/self-hosted). If unreachable or returns retriable failures, it may use OpenAI **only when classification allows fallback** (Public, Internal, Customer with opt-in, never Sensitive/Regulated when OpenAI is disabled).
  - **Operational guardrails**: Fallback to OpenAI requires **explicit tenant opt-in** plus **security approval** recorded in configuration management (e.g., change ticket). Without both, requests are queued for deferred retry on the primary provider instead of using OpenAI.
  - **Regulated contexts**: Set `AI_PROVIDER_OVERRIDE=forbid_openai` and `strictNoFallback=true` in proxy configuration (or per-tenant policy store) to hard-disable OpenAI use; health checks log violations and block rollout if these flags are missing in regulated tenants.
  - **Disable per-request**: Callers can set `aiFallback=false` in request metadata to prevent OpenAI use even when tenant opt-in exists; proxy returns `503 Retry with primary` on failure instead of rerouting.
  - **Audit & approvals**: Any OpenAI fallback emits a mandatory audit event containing approver id, ticket reference, classification, and reason for fallback; events feed compliance dashboards.
- **Internal usage**: Backend services, jobs, and webhooks must call the AI Proxy; direct calls to OpenAI/n8n/self-hosted LLMs are prohibited to preserve observability and policy enforcement.

```
Frontend (PWA)
    │  HTTPS / WS /api/ai/*
    ▼
API Gateway (NestJS path-based forwarding)
    │
    ▼
AI Proxy (contract enforcement, provider selection, retries)
    │                     │
    │                     ├──> n8n workflows (primary orchestration)
    │                     ├──> OpenAI API (managed fallback)
    │                     └──> Self-hosted LLM (local inference)
    └──> Async queues for deferred/failed calls
```

### Technology Stack

| Layer                | Technology                   | Purpose                               | Status       |
| -------------------- | ---------------------------- | ------------------------------------- | ------------ |
| **Frontend**         | React 18+ PWA (TypeScript)   | UI/UX, Offline capability             | ✅ MVP       |
| **State Management** | React Query + Context        | Server state caching, local state     | ✅ MVP       |
| **UI Components**    | shadcn/ui (Radix + Tailwind) | Accessible, consistent UI             | ✅ MVP       |
| **Backend**          | NestJS (TypeScript)          | Business logic, API gateway           | ✅ MVP       |
| **Primary Database** | CouchDB 3.x                  | Document storage, offline sync        | ✅ MVP       |
| **Offline Database** | PouchDB (IndexedDB)          | Client-side document storage          | ✅ MVP       |
| **Search**           | MeiliSearch                  | Full-text search, filtering           | ✅ MVP       |
| **Authentication**   | Keycloak (OIDC)              | Identity provider, SSO                | ✅ MVP       |
| **Automation**       | n8n                          | Workflow automation, AI orchestration | 📋 Phase 2   |
| **Monitoring**       | Prometheus + Grafana + Loki  | Observability stack                   | 📋 Phase 1.5 |

---

## Core Architecture Decisions

### 1. Offline-First Strategy

**Problem**: Field sales team needs to work without internet connectivity in industrial areas.

**Solution**: **PouchDB/CouchDB bidirectional synchronization** with automatic conflict resolution.

#### Data Tiering for Storage Optimization

To manage iOS 50MB storage limits, we implement automatic 3-tier data management:

| Tier          | Size | Content                                             | Management       |
| ------------- | ---- | --------------------------------------------------- | ---------------- |
| **Essential** | 5MB  | User profile, owned customers, active opportunities | Always synced    |
| **Recent**    | 10MB | Last 30 days protocols, recent projects             | LRU cache        |
| **On-Demand** | 35MB | User-pinned documents, historical data              | Manual selection |

**Total Budget**: ~50MB (iOS Safari safe zone with buffer)

#### Browser Storage + Replication Behavior

- **Storage quotas by engine**
  - **Safari/iOS WKWebView**: Practical ~50MB IndexedDB cap per origin before eviction heuristics start; stays stable when the PWA is installed and storage is marked persistent.
  - **Chromium (Chrome/Edge)**: 6–10% of free disk as a per-origin limit; individual PouchDB databases typically stay well below this, but large attachment replication can burst usage.
  - **Firefox**: 10% of free disk globally with per-origin clamps; evicts least-recently-used origins when global pressure triggers.
- **Eviction triggers**
  - User-initiated **Clear Site Data** or storage setting changes immediately purge IndexedDB, causing PouchDB to request a fresh bootstrap sync.
  - **OS-level reclamation** on mobile (low disk space) can clear non-persistent storage; we request `navigator.storage.persist()` on first launch and after large syncs to harden against this.
  - Browsers may evict background tabs that exceed quota during replication bursts; we cap replication batch sizes and attachments per batch (see below) to avoid transient quota spikes.
- **Back-pressure handling**
  - PouchDB `changes` feeds are throttled when `storageEstimate.quota` approaches 85% of the effective cap; replication switches to **metadata-only** until free space recovers.
  - Attachments larger than **2MB** are fetched in staggered batches (max 3 attachments per replication cycle) with progressive LZ compression; skipped attachments are marked with `pendingAttachment: true` for retry.
  - When persistent storage is unavailable, the app surfaces a **"Storage Nearly Full"** toast, pauses background replication, and prompts the user to free space or deselect on-demand tiers.

#### Conflict Escalation and Audit Reconciliation

- **Automatic vs. manual path**
  - Auto-resolvable conflicts follow the existing merge policies; manual conflicts raise a **"needs review"** flag on the document and defer replication of child attachments until resolved.
  - Escalated conflicts trigger a **three-way merge view** on next connectivity with base, local, and remote revisions.
- **Audit log chaining across offline edits**
  - Every offline mutation writes a local audit record (hash + previousHash) in `kompass-audit` within PouchDB; upon reconnect, these entries replicate before operational docs to preserve chain integrity.
  - If divergent chains appear (e.g., two offline editors), reconciliation creates a **branch-aware chain**: two audit entries reference the same `previousHash`; the server appends a **link entry** documenting the manual merge decision.
  - The immutable chain always advances; even rejected changes are recorded with `operation: "REJECTED"` and the winning revision hash to keep tamper evidence intact.
- **Examples**
  - **Large attachment conflict**: User A uploads a 5MB photo offline; User B edits metadata online. During sync, the attachment download defers until metadata conflict is resolved; once resolved, the attachment streams in 1MB chunks with back-pressure and the audit log records the attachment hash plus chunk order to confirm integrity.
  - **Dense history replay**: A project note edited 20 times offline creates 20 audit entries chained locally. On reconnection, the chain replicates first, then the compacted document revision set. If a conflict arises on revision 12 vs. 20, the merge decision is logged as a link entry, and the losing branch remains auditable without being the live state.

#### Conflict Resolution Strategy

**90% Automatic Resolution:**

- **Last-Write-Wins**: For metadata fields (tags, categories)
- **Merge-Append**: For text fields (notes, comments)
- **Boolean-True-Wins**: For status flags

**10% Manual Resolution:**

- Financial data conflicts
- Status transitions
- Critical customer information

### 2. GoBD Compliance Architecture

**Dedicated Immutable Audit Log**: Separate CouchDB database (`kompass-audit`) with blockchain-style integrity chain.

#### "Audit-Then-Write" Pattern

```typescript
async function auditThenWrite(operation: Operation): Promise<Document> {
  // 1. Calculate hash of new document state
  const newHash = sha256(JSON.stringify(newDocument));

  // 2. Get previous hash (creates cryptographic chain)
  const previousHash = await getLastAuditHash(documentId);

  // 3. Create audit log entry with digital signature
  const auditEntry = {
    documentId,
    operation: 'UPDATE',
    hash: newHash,
    previousHash,
    signature: await signWithPrivateKey(newHash),
    userId: currentUser.id,
    timestamp: new Date(),
    changes: detectFieldChanges(oldDocument, newDocument),
  };

  // 4. Write to immutable audit log FIRST
  await auditDatabase.insert(auditEntry);

  // 5. Only then write operational document
  return await operationalDatabase.update(newDocument);
}
```

#### Key Lifecycle, Retention, and Reconciliation

- **Key lifecycle (generation → rotation → storage)**
  - **Generation**: Per-tenant signing keys are generated with `ed25519` inside a hardened Key Management Service (KMS) at onboarding; the public portion is stored in CouchDB for signature verification.
  - **Rotation**: Keys rotate every **90 days** or on incident triggers (suspected compromise, tenant off-boarding). Rotation uses overlapping validity windows—new keys sign current writes while old keys remain valid for verification until all in-flight replays settle.
  - **Storage**: Private keys never leave KMS; the application only receives short-lived signing tokens. Public keys are replicated to PouchDB for offline verification and pinned in the audit database to preserve historical verification context.
- **Retention enforcement for audit data**
  - Nightly **TTL sweeps** remove operational document backups older than **180 days** while leaving the immutable audit chain intact.
  - **Legal hold flags** at tenant or document level pause deletions; retention jobs skip entries with `legalHold=true` and log skips for compliance review.
  - **Attachment compaction** compresses or purges large binary deltas after **30 days** when not under legal hold; hashes and metadata remain to keep the chain verifiable.
- **Reconciliation workflow: PouchDB replicas ↔ immutable audit log**
  - **Step 1: Pre-sync verification** — PouchDB fetches the latest audit `previousHash` from CouchDB; if the local head differs, the client queues a reconciliation task instead of immediately pushing writes.
  - **Step 2: Merge + conflict handling** — During bi-directional replication, operational docs resolve conflicts (auto/manual as above). Each resolved revision triggers a **shadow audit write** that records the winning revision id and hashes of losing branches.
  - **Step 3: Integrity checks post-conflict** — After conflict resolution, clients recompute the audit chain from the last agreed checkpoint and compare against server-provided hash summaries. Any divergence marks the local replica as **"quarantined"**; replication switches to **read-only** until a full resync rebuilds the chain.
  - **Step 4: Finalize + compact** — Once hashes align, the reconciliation task writes a **link entry** that binds the reconciled revision to its historical branches, then resumes normal replication with smaller batch sizes until the next checkpoint is reached.


### 3. Clean Architecture Implementation

**Strict Layer Separation:**

```
Controller → Service → Repository → Database
     ↓         ↓          ↓
   DTOs     Business    CouchDB
             Logic
```

**Dependency Rules:**

- Controllers handle HTTP, delegate to services
- Services contain business logic, use repository interfaces
- Repositories handle data persistence only
- Domain entities are framework-agnostic

### 4. RBAC Security Model

**5-Role System:**

- **ADM** (Außendienst): Own customers and opportunities only
- **INNEN** (Innendienst): Team customers, all opportunities
- **PLAN** (Planning): Assigned projects, resource management
- **BUCH** (Accounting): Financial data, compliance reporting
- **GF** (Management): Complete system access, executive dashboards

**Entity + Field-Level Permissions:**

- Entity-level: Can user access customer data?
- Record-level: Can user access THIS specific customer?
- Field-level: Can user see margin/profit information?

#### RBAC Rollout Playbooks

**Migration Sequencing (zero-downtime):**

1. **Schema + seed first**: Deploy database migrations that add role/permission tables and seed default roles without altering existing auth flows.
2. **Dual-write phase**: Enable services to populate both legacy access flags and the new RBAC tables; keep reads on legacy to avoid behavior drift.
3. **Read-cutover**: Flip feature flag so API reads use RBAC checks; retain dual-write for one release to support rollback.
4. **Cleanup**: Remove legacy flags and disable dual-write once telemetry confirms stable access patterns for 7 days.

**Pre/Post-Deploy Regression Suites (API + UI):**

- **Pre-deploy smoke**: Token issuance/refresh, role claim propagation in ID token, health checks for RBAC guard endpoints.
- **API regression (pre/post)**: CRUD for customers/projects/opportunities with each role, forbidden checks for cross-role access, field-level masking for margin/profit, audit-log emission on role change.
- **UI regression (post)**: Navigation visibility per role, disabled actions for insufficient permissions, offline re-sync respecting RBAC scopes after reconnect.

**Telemetry & Alerting Signals:**

- **Auth error rates**: HTTP 401/403 rates per route and per role; alert if >2x baseline for 10 minutes post-rollout.
- **Role-change audits**: Structured events for role grants/revocations with actor, subject, ticket id; alert on spikes or changes outside change window.
- **Policy cache health**: Cache hit/miss ratios for RBAC policy evaluations; alert on sustained miss spikes (possible cache stampede) and evaluation latency >200ms p95.
- **Token claim drift**: Compare Keycloak role claims vs. RBAC database assignments; emit discrepancy metrics and alert on >1% mismatch.

**Rollback Procedures (API-aligned):**

- **Soft rollback**: Toggle feature flag to revert API authorization to legacy checks while keeping RBAC dual-write; clear policy caches to avoid stale denies.
- **Token alignment**: Force Keycloak realm cache invalidation so tokens drop new roles/claims; expire active sessions via global logout API to prevent inconsistent permissions.
- **Data safety**: Preserve RBAC audit entries during rollback; block destructive migrations until post-mortem completes.
- **Forward path**: After rollback, re-run pre-deploy smoke tests on legacy path, patch identified defects, and repeat migration from step 2 with narrowed blast radius (pilot tenants first).

---

## Phase-Based Evolution

### Phase 1: MVP Foundation (Current - 4 months)

**Core Capabilities:**

- ✅ Customer, Contact, Location management
- ✅ Opportunity tracking and pipeline management
- ✅ Basic project coordination
- ✅ Offline-first mobile experience
- ✅ Role-based access control
- ✅ GoBD-compliant audit trails

**Technology Stack:**

- React PWA + PouchDB (offline storage)
- NestJS + CouchDB (backend + primary database)
- MeiliSearch (search functionality)
- Keycloak (authentication)

### Phase 1.5: Production Observability (Parallel)

**Monitoring Stack:**

- **Prometheus**: Metrics collection (API latency, error rates)
- **Grafana Loki**: Log aggregation and analysis
- **Grafana Tempo**: Distributed tracing
- **Grafana Dashboards**: System health and business KPIs

### Phase 2: AI & Automation Extensions (6-8 months)

**AI Integration Architecture:**

_Weitere technische Details, Container-Layouts und Rollout-Playbooks findest du im [AI Extensions Implementation Guide](./ai-extensions/AI_Automation_Extensions_Implementation_Guide.md)._

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │─────▶│   Backend    │─────▶│  BullMQ      │─────▶│    n8n       │
│   (React)    │◀─────│  (NestJS)    │◀─────│  (Redis)     │◀─────│  (Workflows) │
└──────────────┘  WS  └──────────────┘      └──────────────┘      └──────────────┘
       │                     │                      │                      │
       │                     │                      │                      │
       └──────────────┬──────┴──────────────────────┴──────────────────────┘
                      │
              ┌───────▼───────┐
              │  AI Services  │
              │ • Whisper STT │
              │ • LLM (GPT-4) │
              │ • ML Models   │
              └───────────────┘
```

**New Capabilities:**

- **RAG Knowledge Management**: Semantic search across all documents
- **Audio Transcription**: Whisper-powered meeting notes
- **Automated Workflows**: n8n-orchestrated business processes
- **Predictive Analytics**: Lead scoring, risk assessment

### Phase 3: Advanced Intelligence (8-10 months)

**Enhanced Data Architecture:**

```
CouchDB (Operational/OLTP)     PostgreSQL (Analytical/OLAP)
         │                              ▲
         │ _changes Feed                 │
         └─────────▶ CDC Service ───────┘
                    (Transform)
                         │
                         ▼
                   ┌──────────────┐
                   │    Neo4j     │  Knowledge Graph
                   │   (Graph)    │  (Relationships)
                   └──────────────┘
```

**Advanced Capabilities:**

- **CQRS Pattern**: Separate read/write stores for performance
- **Knowledge Graph**: Complex relationship queries via Neo4j
- **Self-Service BI**: Metabase dashboards for business users
- **Advanced ML**: Predictive forecasting, automated insights

---

## Technical Implementation Details

### Backend Architecture (NestJS)

**Module Structure:**

```
apps/backend/src/
├── modules/
│   ├── customer/
│   │   ├── customer.controller.ts     # HTTP endpoints
│   │   ├── customer.service.ts        # Business logic
│   │   ├── customer.repository.ts     # Data access
│   │   └── dto/                       # Data transfer objects
│   ├── opportunity/                   # Similar structure
│   ├── project/                       # Similar structure
│   └── invoice/                       # Similar structure
├── shared/
│   ├── guards/                        # RBAC, JWT authentication
│   ├── interceptors/                  # Logging, transformation
│   └── filters/                       # Global exception handling
└── modules/
    └── auth/                          # Keycloak OIDC integration
        ├── strategies/                # JWT strategy for Keycloak
        ├── guards/                    # JWT authentication guard
        ├── decorators/                # @CurrentUser() decorator
        ├── auth.controller.ts         # /auth/me endpoint
        └── auth.module.ts             # Auth module configuration
```

**Security Implementation:**

- Every endpoint has `@UseGuards(JwtAuthGuard, RbacGuard)`
- Repository layer enforces record-level permissions
- Audit service logs all data modifications
- Input validation via class-validator DTOs

### Frontend Architecture (React PWA)

**Feature-Based Structure:**

```
apps/frontend/src/
├── features/
│   ├── customer/
│   │   ├── components/               # React components
│   │   ├── hooks/                    # Custom hooks
│   │   ├── services/                 # API clients
│   │   └── types/                    # TypeScript types
│   ├── opportunity/                  # Similar structure
│   └── project/                      # Similar structure
├── shared/
│   ├── components/ui/                # shadcn/ui components
│   ├── hooks/                        # Reusable hooks
│   └── utils/                        # Utility functions
└── lib/
    ├── api-client.ts                 # Axios configuration
    ├── offline-sync.ts               # PouchDB integration
    └── auth.ts                       # Authentication logic
```

**Offline Implementation:**

- PouchDB for local document storage
- React Query for server state caching
- Service Worker for app shell caching
- Automatic background sync with conflict detection

### Database Design

**Entity Relationships:**

```
Customer 1:N Location
Customer 1:N Contact
Customer 1:N Opportunity
Opportunity 1:1 Project (when won)
Project 1:N Invoice
Project 1:N Task
```

**Validation Rules:**

- Company name: 2-200 chars, pattern-validated
- VAT number: German format `DE123456789`
- Email: Standard validation with domain check
- Phone: International format with length limits
- Financial: Euro amounts with 2 decimal precision

---

## Security & Compliance

### DSGVO (GDPR) Compliance

**Data Protection Measures:**

- All data stored on company-controlled infrastructure
- Granular consent management for AI features
- Automatic data retention and deletion policies
- Privacy dashboard for user data management
- DPO workflows with impact assessment templates

**Consent Management:**

```typescript
interface DSGVOConsent {
  marketing: boolean;
  aiProcessing: boolean;
  dataSharing: boolean;
  grantedAt: Date;
  grantedBy: string;
  revokedAt?: Date;
}
```

### GoBD Financial Compliance

**Immutability Requirements:**

- Invoice data immutable after finalization
- Cryptographic integrity chain for audit trail
- Change logging with user attribution
- Digital signatures for tamper detection
- 10-year retention for financial records

**Audit Trail Implementation:**

```typescript
interface AuditLogEntry {
  documentId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  hash: string; // SHA-256 of document state
  previousHash: string; // Blockchain-style chain
  signature: string; // Digital signature
  userId: string;
  timestamp: Date;
  changes: FieldChange[];
}
```

### Security Architecture

**Multi-Layer Security:**

1. **Frontend**: Input validation, XSS prevention, CSP headers
2. **API**: Rate limiting, CORS, JWT authentication
3. **Backend**: RBAC enforcement, SQL injection prevention
4. **Database**: User isolation, validate functions, encryption at rest
5. **Network**: TLS 1.3, internal service isolation, firewall rules

**Authentication Flow:**

1. User logs in via Keycloak (OIDC) - redirects to Keycloak login page
2. Keycloak issues JWT token with user roles (ADM, INNEN, PLAN, BUCH, GF)
3. Frontend stores token and includes in Authorization header for API calls
4. Backend validates JWT token using JWKS (JSON Web Key Set) from Keycloak
5. Backend extracts user roles from token for RBAC enforcement
6. Token refresh handled automatically on frontend before expiration
7. Logout invalidates session in Keycloak and clears local storage

**JWT Token Structure:**

- Contains user ID (`sub`), email, and roles in `resource_access.{client-id}.roles` or `realm_access.roles`
- Validated using RS256 algorithm with Keycloak's public keys
- Token expiration handled with automatic refresh (30 seconds before expiry)

**Backend Authentication:**

- `JwtStrategy` validates tokens using `jwks-rsa` library
- `JwtAuthGuard` protects all endpoints (except public routes marked with `@Public()`)
- `@CurrentUser()` decorator provides authenticated user in controllers
- All controllers use `@UseGuards(JwtAuthGuard, RbacGuard)` for protection

**Frontend Authentication:**

- `keycloak-js` library handles OIDC flow
- `AuthContext` provides authentication state and user information
- `ProtectedRoute` component redirects unauthenticated users to login
- API client automatically injects JWT token in requests and handles 401 errors

---

## AI & Automation Architecture (Phase 2+)

### Message Queue Pattern for AI Integration

**Asynchronous Processing:**
Long-running AI tasks (transcription, analysis) are handled via **BullMQ** job queue:

```typescript
// Frontend starts AI job
const jobId = await api.post('/ai/transcribe', { audioFile });

// Backend queues job
await transcriptionQueue.add('transcribe', { jobId, fileUrl });

// n8n workflow processes job
// WebSocket notifies frontend of completion
```

### RAG (Retrieval-Augmented Generation)

**Components:**

- **Vector Database**: Weaviate for semantic search
- **Embeddings**: Multilingual-E5-Large for German documents
- **LLM**: Llama 3 70B (self-hosted) or GPT-4 (cloud option)
- **Framework**: LlamaIndex for document processing pipeline

**Query Flow:**

1. User asks question in natural language
2. System retrieves relevant documents via semantic search
3. LLM generates answer based on retrieved context
4. Response includes sources and confidence scores

### Workflow Automation

**n8n Integration:**

- Automated follow-up sequences
- Meeting transcription and summarization
- Invoice reminders and payment tracking
- Project status notifications
- Lead scoring and prioritization

---

## Performance & Scalability

### Performance Targets

| Metric           | Target                | Monitoring          |
| ---------------- | --------------------- | ------------------- |
| API Response P50 | ≤ 400ms               | Prometheus          |
| API Response P95 | ≤ 1.5s                | Prometheus          |
| Dashboard Load   | ≤ 3s                  | Grafana             |
| Search Response  | ≤ 500ms               | MeiliSearch metrics |
| Offline Sync     | ≤ 30s for 100 changes | Custom metrics      |

### Sizing & Load Assumptions

- **Sync spikes**: Design for **10x baseline replication bursts** (e.g., branch offices coming online Monday 8–10am) with up to **5k doc revisions per tenant per hour**. Batch replication is capped (metadata-first, attachments staggered) to keep P95 sync <45s during spikes.
- **Conflict resolution**: Expect **3–5% of replicated docs to enter conflict** after offline workdays. Auto-resolution handles ~90%; plan for **500–1k manual conflict items/day** to be queued without blocking replication. CouchDB conflict queues are budgeted for **2× daily peak** to avoid backpressure.
- **Projected concurrency**: Phase 1 supports **50–75 active users**; Phase 2 (automation + AI) targets **150–200 concurrent websocket/API sessions** with **2–3 concurrent syncs per user device**. Horizontal scale triggers when P95 API latency >1.5s or replication queue depth exceeds 2 minutes of work.

### Scaling Strategy

**Current Capacity**: 20-50 concurrent users
**Scaling Approach**: Vertical scaling first, then horizontal

**Scale-Out Plan:**

- **Backend**: Multiple NestJS instances behind load balancer
- **Database**: CouchDB clustering (3-node cluster)
- **Search**: MeiliSearch sharding or migration to Elasticsearch
- **AI**: GPU server pool for parallel AI processing
- **Vector + automation** (Phase 2+): Isolate Weaviate/vector DB and BullMQ/Redis tiers with dedicated nodes and network policies.

### Capacity & Isolation Guidance (Phase 2+)

- **Weaviate / Vector DB**: Run on **dedicated nodes with fast NVMe**; target **50–100 QPS** hybrid search with **<150ms P95**. Keep ingestion isolated from query replicas; enforce tenant namespaces and OPA policies. Plan for **2 replicas + 1 ingest** per 100k vectors; autoscale vector memory to keep **HNSW graph in-memory <70% RAM**.
- **BullMQ / Redis**: Use **Redis Cluster or at least primary + replica**; dedicate **separate DB/namespace** for background jobs vs. cache/session data. Size for **20k enqueued jobs/hour** bursts from sync + AI tasks with **P95 dequeue <1s**. Enable **client-side backpressure** and **rate limits per tenant** to prevent noisy-neighbor effects.
- **GPU inference**: Start with **1–2 A10/T4-class GPUs** for RAG and Whisper; budget **20–30 req/s streaming** with **P95 latency <3s**. Use **per-tenant concurrency guards** and **queue isolation** (BullMQ) so long-running transcriptions do not starve short chat completions. Keep **health checks + circuit breakers** in the AI proxy to reroute to CPU/n8n when GPU queue >30s.
- **Vector DBs (Phase 2+)**: For additional embeddings stores (e.g., PGVector for analytics), isolate from primary search path; use **async ingestion** from BullMQ and **read replicas** for dashboards. Enforce **disk utilization <70%** and **write-ahead log on dedicated volume** to protect sync throughput.

---

## Operations & Deployment

### Deployment Architecture

**Docker Compose**: All services containerized for consistent deployment

**Environments:**

- **Development**: Local Docker Compose with hot reload
- **Staging**: Production-like with anonymized data
- **Production**: Full stack with monitoring and backups

### Backup Strategy

| Component        | Frequency        | Retention | Recovery Time |
| ---------------- | ---------------- | --------- | ------------- |
| CouchDB          | Daily            | 30 days   | <1 hour       |
| Configuration    | With each change | 90 days   | <15 minutes   |
| Application Code | Git repository   | Permanent | <10 minutes   |
| User Files       | Daily            | 30 days   | <1 hour       |

### Monitoring & Alerting

**Health Checks:**

- Application health endpoints
- Database connectivity checks
- Service dependency verification
- Automated container restarts

**Alerting Thresholds:**

- API error rate >1% → Immediate alert
- Response time P95 >3s → Warning
- Disk usage >90% → Warning
- Container down → Immediate alert

---

## Migration & Evolution Path

### MVP to Advanced Features

The architecture is designed for **non-breaking evolution**:

For the phased sequence, rollout prerequisites, and migration safeguards, follow the [Architecture Evolution Guide](./evolution/ARCHITECTURE_EVOLUTION_GUIDE.md) in conjunction with the steps below.

1. **Phase 1 (MVP)**: Core CRM/PM functionality with offline capability
2. **Phase 2 (AI)**: Add AI services without changing core architecture
3. **Phase 3 (Analytics)**: Add analytical database via CQRS pattern
4. **Phase 4 (Intelligence)**: Add knowledge graph and advanced automation

### Breaking Change Policy

**Avoid breaking changes** through:

- Feature flags for new functionality
- Backward-compatible API versioning
- Database migrations with rollback procedures
- Phased rollouts with A/B testing

### Technology Upgrade Path

**Planned Evolutions:**

- CouchDB single-node → CouchDB cluster (when needed)
- MeiliSearch → Elasticsearch (if scaling requires)
- Cloud AI → Self-hosted AI (for complete data sovereignty)
- Monolithic backend → Selective microservices (if complexity requires)

---

## Risk Mitigation

### Risk Register

| Risk | Likelihood | Impact | Mitigation Steps | Detection & Monitoring Signals | Owner | Contingency Actions |
| ---- | ---------- | ------ | ---------------- | ----------------------------- | ----- | ------------------- |
| Storage complexity in offline tiering leads to unexpected quota failures | Medium | High | Enforce 3-tier storage policy with hard caps, throttle replication batches, and surface "Storage Nearly Full" UX prompts | PouchDB replication metrics, browser `storageEstimate` thresholds, frontend storage alerts | Mobile Lead | Pause attachment replication, force metadata-only sync, guide users to free space and reattempt sync after clearance |
| Data loss during sync or conflict resolution | Low | Critical | Default to continuous bidirectional sync with conflict policies, audit-then-write chain, and deferred attachment download on conflicts | Replication error rates, audit chain gaps, conflict queue length in CouchDB metrics | Backend Lead | Switch to read-only mode for affected docs, trigger immediate resync from last good snapshot, and run audit reconciliation playbook |
| Performance degradation under heavy queries/search | Medium | Medium | Aggressive caching (React Query), indexed queries, capped attachment batch sizes, and scoped search filters | API latency SLOs in Grafana, MeiliSearch query latency, PWA Web Vitals | Platform Lead | Enable feature flags to disable heavy widgets, scale read replicas/MeiliSearch nodes, and run cache warmup jobs |
| Architecture complexity slowing delivery | Medium | Medium | Phased rollout (MVP→Automation→Analytics), ADR discipline, and feature flags to isolate change risk | ADR cadence adherence, feature flag coverage reports, milestone burn-down | Architecture Lead | De-scope non-critical epics, freeze new ADRs temporarily, and allocate spike budget to unblock decisions |
| Limited IT resources for operations | Medium | Medium | Self-contained Docker deployment, infra-as-code scripts, and automated monitoring setup | CI pipeline results, infra drift alerts, on-call load reports | DevOps Lead | Engage managed support window, temporarily reduce release cadence, and prioritize reliability work in sprint planning |
| Vendor dependencies or lock-in risk | Low | High | Prefer open-source/self-hosted components (Keycloak, MeiliSearch, CouchDB) with documented migration paths | Dependency SBOM changes, license scans, availability checks for third-party APIs | Security Lead | Execute migration playbook to alternate OSS component, enable read-only mode during cutover, and communicate downtime window |
| Compliance gaps (GoBD/DSGVO) | Low | Critical | Immutable audit logs, consent-aware AI routing, retention policies, and purpose-of-use tagging | Audit log completeness dashboards, DPA/consent flag drift alerts, redaction policy checks | Compliance Officer | Invoke incident response for data handling violations, suspend AI fallback to public clouds, and run retroactive audit export for regulators |

---

## Implementation Roadmap

### Phase 1 (Q1-Q2 2025): MVP Foundation ✅

**Duration**: 16 weeks  
**Team**: 6.75 FTE  
**Budget**: €230K

**Deliverables:**

- Core CRM entities and workflows
- Offline-first PWA with 50MB quota management
- RBAC system with 5 roles
- GoBD-compliant audit logging
- MeiliSearch integration
- Basic reporting dashboard

### Phase 2 (Q2-Q3 2025): AI & Automation 📋

**Duration**: 8 weeks  
**Budget**: €60K

**Deliverables:**

- Audio transcription (Whisper integration)
- RAG knowledge management system
- n8n workflow automation
- WebSocket real-time updates
- Predictive lead scoring

### Phase 3 (Q4 2025): Advanced Analytics 📋

**Duration**: 8-10 weeks
**Budget**: €70K

**Deliverables:**

- CQRS analytics layer (PostgreSQL)
- Neo4j knowledge graph
- Advanced ML forecasting
- Self-service BI dashboards
- Automated model retraining

---

## Related Documentation

- **[Data Model Specification](../specifications/data-model.md)** - Complete entity definitions and validation
- **[API Specification](../specifications/api-specification.md)** - REST endpoint documentation
- **[RBAC Permissions](../specifications/rbac-permissions.md)** - Security model and permissions
- **[Test Strategy](../specifications/test-strategy.md)** - Quality assurance approach
- **[NFR Specification](../specifications/nfr-specification.md)** - Performance and scalability requirements
- **[Product Vision](../product-vision/README.md)** - Business requirements and strategic direction

---

## Architecture Governance

### Decision Framework

**All architectural decisions follow ADR (Architecture Decision Record) pattern:**

1. Document context and options evaluated
2. State decision with clear rationale
3. Track implementation and outcomes
4. Review decisions quarterly for relevance

### Change Management

**Architectural changes require:**

- Linear issue with impact assessment
- Architecture team review and approval
- Documentation updates
- Implementation plan with rollback procedure
- Post-implementation review

### Incident-Driven Governance Responses

**Every Severity 1–2 incident triggers the following governance actions within defined timelines:**

- **ADR review (Owner: Architecture Lead)**
  - Create/update an ADR that documents the incident context, the architectural options considered, and the chosen mitigation within **3 business days** of incident closure.
  - Flag any architectural debt uncovered and add follow-up ADRs to the **next quarterly review cycle** if not immediately actionable.
- **Configuration audit (Owner: DevSecOps/Platform Team)**
  - Run a focused audit of infrastructure-as-code and runtime configuration baselines within **24 hours** to confirm drift, secrets hygiene, and policy alignment.
  - Capture findings in the incident ticket with remediation tasks, each assigned an SLA based on severity (e.g., **5 business days** for Sev 1 blocking items).
- **Rollout freeze (Owner: Release Manager)**
  - Apply a targeted freeze on affected services/environments until guardrails are verified (health checks green, audit items closed or risk-accepted).
  - Document freeze scope and exit criteria in the change log; lift the freeze only after Architecture Lead and DevSecOps sign-off.
- **Documentation updates (Owner: Technical Writer + Service Owner)**
  - Update runbooks, onboarding guides, and SLO/SLA definitions to reflect new guardrails or operational steps within **2 business days**.
  - Ensure code-level docs (READMEs/config comments) are updated alongside ADR changes to keep implementation and guidance aligned.

**Closing the loop:** The Incident Commander tracks all above actions in the root incident ticket and confirms completion during the **post-incident review (scheduled within 7 business days)**. Any open items convert into dated follow-up issues with named owners; the Architecture Lead reports status in the next governance sync.

### Quality Assurance

**Architecture compliance checked via:**

- Code review guidelines
- Automated linting rules
- Integration test coverage
- Performance monitoring
- Security scanning

---

Last updated: 2025-01-28  
Next review: Q2 2025 (Post-MVP launch)
