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
- **Boundary**: All AI traffic uses `/api/ai/*` paths over HTTPS or WebSocket; responses use a unified envelope (request id, status, payload, error) and explicit streaming events for partial tokens.
- **Routing**: API gateway performs path-based forwarding for `/api/ai/*` to the AI Proxy; other backend routes remain untouched.
- **Provider selection**:
  - **n8n workflows** (default for orchestrations and retrieval-augmented flows) enabled via `AI_PROVIDER=n8n`.
  - **OpenAI** (managed SaaS) enabled via `AI_PROVIDER=openai` with API key/endpoint variables.
  - **Self-hosted LLM** (e.g., local Ollama/Inference server) enabled via `AI_PROVIDER=self_hosted` and provider-specific host flags.
- **Fallback logic**: The proxy prefers the configured primary provider, falls back to OpenAI if n8n/self-hosted are unavailable, and finally queues the request for deferred processing when no provider is reachable; retries are idempotent via request ids.
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

### Scaling Strategy

**Current Capacity**: 20-50 concurrent users
**Scaling Approach**: Vertical scaling first, then horizontal

**Scale-Out Plan:**

- **Backend**: Multiple NestJS instances behind load balancer
- **Database**: CouchDB clustering (3-node cluster)
- **Search**: MeiliSearch sharding or migration to Elasticsearch
- **AI**: GPU server pool for parallel AI processing

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

### Technical Risks

**Storage Complexity** → **Solved**: Automatic tiering, no manual management
**Data Loss Risk** → **Solved**: Continuous sync, conflict resolution, audit trail
**Performance** → **Solved**: Aggressive caching, optimized queries, monitoring
**Complexity** → **Solved**: Phased approach, proven technologies, comprehensive docs

### Operational Risks

**Limited IT Resources** → **Solved**: Self-contained Docker deployment, automated monitoring
**Vendor Dependencies** → **Solved**: Open-source stack, self-hosted components
**Compliance** → **Solved**: Built-in audit trails, privacy controls, retention policies

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
