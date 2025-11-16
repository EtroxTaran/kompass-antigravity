# KOMPASS - Integrated CRM & Project Management

**Version:** 1.0.0  
**Status:** Development  
**Architecture Readiness:** 95%

> "Ein Team, ein Tool – volle Transparenz und Effizienz für nachhaltigen Projekterfolg."

## Overview

KOMPASS is an integrated CRM and Project Management system specifically designed for mid-sized Ladenbau (store construction) companies. It combines customer management, opportunity tracking, project execution, and financial management in a single, offline-first platform.

### Key Features

- **360° Customer View** - All customer data in one place
- **Offline-First Architecture** - Work anywhere, sync automatically
- **Integrated CRM & PM** - Seamless transition from lead to project
- **Supplier & Material Management** - Complete procurement workflows (Phase 1)
- **Real-Time Cost Tracking** - Project budgets update from deliveries
- **GoBD Compliant** - German tax compliance for invoices and projects
- **DSGVO/GDPR Ready** - Privacy by design
- **Role-Based Access Control** - Fine-grained permissions
- **Mobile-Optimized** - iOS and Android PWA support

---

## 🚨 Addressing Pre-Mortem Concerns

A comprehensive [pre-mortem analysis](docs/reviews/PROJECT_KOMPASS_PRE-MORTEM_ANALYSIS.md) identified **four critical risks** that could lead to project failure. We've addressed each risk with concrete mitigation strategies:

### Danger #1: AI Overreach

**Risk:** Shifting from focused CRM to "Autonomous Business Partner" creates feature bloat.

**Mitigation:**

- ✅ [AI Strategy & Phasing](docs/product-vision/AI_STRATEGY_AND_PHASING.md) - 3-phase roadmap with data quality gates
- ✅ Phase 1 delivers full value **without** predictive AI
- ✅ All AI features marked with phase indicators and user-controlled toggles
- ✅ [AI Data Requirements](docs/specifications/AI_DATA_REQUIREMENTS.md) - Exact thresholds prevent premature AI launches

### Danger #2: Data Desert

**Risk:** AI predictions require historical data that doesn't exist, leading to inaccurate predictions.

**Mitigation:**

- ✅ System functional with **zero historical data** (Phase 1 works on day 1)
- ✅ Confidence thresholds: No predictions shown if <70% confidence
- ✅ Explainability required for all predictions (user trust through transparency)
- ✅ [Offline PWA Strategy](docs/specifications/OFFLINE_PWA_DATA_STRATEGY.md) - Tiered storage ensures reliability

### Danger #3: Critical Workflow Gaps

**Risk:** Missing Supplier and Material Management modules make KOMPASS incomplete for INN and PLAN personas.

**Mitigation:**

- ✅ [Supplier Management Module](docs/specifications/SUPPLIER_SUBCONTRACTOR_MANAGEMENT_SPEC.md) - Complete supplier lifecycle (Phase 1)
- ✅ [Material Management Module](docs/specifications/MATERIAL_INVENTORY_MANAGEMENT_SPEC.md) - Material catalog, procurement, real-time cost tracking (Phase 1)
- ✅ [INN Dashboard](ui-ux/06-dashboards/inn-dashboard.md) - Dedicated dashboard for procurement workflows
- ✅ Real-time project cost updates from material deliveries (<2s latency)

### Danger #4: Brittle Lexware Integration

**Risk:** Manual CSV integration creates data integrity issues and operational frustration.

**Mitigation:**

- ✅ [Lexware Integration Strategy](docs/specifications/LEXWARE_INTEGRATION_STRATEGY.md) - 4-phase roadmap with automation commitment
- ✅ Phase 1: CSV with validation tools and reconciliation dashboard (acknowledge pain, minimize it)
- ✅ Phase 2 (Month 3-6): Semi-automated sync (90% automation, 4h latency)
- ✅ Phase 3 (Month 6-12): Real-time bidirectional sync (99% automation, <10min latency)
- ✅ [Financial Data Flow](docs/specifications/FINANCIAL_DATA_FLOW.md) - Complete revenue/expense flows documented

### Validation & Testing

- ✅ [Pre-Mortem Validation Checklist](docs/reviews/PRE_MORTEM_VALIDATION_CHECKLIST.md) - Specific tests for all 4 dangers
- ✅ [User Adoption Strategy](docs/product-vision/USER_ADOPTION_STRATEGY.md) - Adoption tactics per persona
- ✅ [Revised Implementation Roadmap](docs/implementation/REVISED_IMPLEMENTATION_ROADMAP.md) - Sprint-level priorities

**Bottom Line:** We've transformed pre-mortem warnings into actionable mitigation strategies. KOMPASS will be **reliable, complete, and user-friendly** before adding intelligence.

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker (optional, for local services)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd kompass

# Install dependencies
pnpm install

# Setup development environment
./scripts/setup-dev.sh

# Start development servers
pnpm dev
```

### Development URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api
- **CouchDB:** http://localhost:5984/\_utils
- **MeiliSearch:** http://localhost:7700

## Architecture

### Technology Stack

**Frontend:**

- React 18 + TypeScript
- Vite + PWA plugin
- Redux Toolkit + Zustand (state management)
- React Query (server state)
- PouchDB (offline storage)
- shadcn/ui (UI components)
- Tailwind CSS

**Backend:**

- NestJS + TypeScript
- CouchDB (database)
- MeiliSearch (search)
- Keycloak (authentication)
- n8n (workflow automation)

### Monorepo Structure

```
kompass/
├── apps/
│   ├── backend/        # NestJS API
│   └── frontend/       # React PWA
├── packages/
│   └── shared/         # Shared types & utilities
├── tests/
│   ├── e2e/            # Playwright E2E tests
│   ├── integration/    # API integration tests
│   └── performance/    # k6 load tests
├── templates/          # Code generation templates
├── scripts/            # Development scripts
└── docs/               # Comprehensive documentation
```

### Domain Model

Core entities:

- **Customer** - Business customers with contacts and locations
- **Opportunity** - Sales pipeline tracking
- **Offer** - Versioned quotes and proposals
- **Project** - Active project execution
- **Task** - Project work items
- **Invoice** - GoBD-compliant invoicing
- **Payment** - Payment tracking
- **Protocol** - Activity logs and notes

See `docs/reviews/DATA_MODEL_SPECIFICATION.md` for complete entity definitions.

## Development

### Developer Workflow

KOMPASS uses Linear-integrated Git workflow with automated quality gates.

**Quick workflow** (trunk-based development):

```bash
# 1. Create branch for Linear issue KOM-123
git checkout main
git pull origin main
git checkout -b feature/KOM-123-description

# 2. Make changes and commit
git commit -m "feat(KOM-123): add feature description"
# Pre-commit hooks run: linting, formatting, type checking

# 3. Push branch
git push origin feature/KOM-123-description
# Pre-push hooks run: unit tests, documentation checks

# 4. Create PR on GitHub (target: main)
# CI/CD runs: all quality gates (11 checks)

# 5. After approval, merge to main
# Auto-deploys to staging

# 6. QA on staging, then create production tag
git tag v1.2.3
git push origin v1.2.3
# Tag-triggered production deployment
```

**See**: `docs/processes/DEVELOPMENT_WORKFLOW.md` for complete workflow

### Generate New Entity

```bash
# Generate complete CRUD (backend + frontend + shared)
./scripts/generate-entity.sh customer

# Generate backend module only
./scripts/generate-module.sh opportunity

# Generate frontend feature only
./scripts/generate-feature.sh project
```

### Run Tests

```bash
# All tests
pnpm test

# Unit tests only (70% of tests)
pnpm test:unit

# Integration tests (20% of tests)
pnpm test:integration

# E2E tests (10% of tests)
pnpm test:e2e

# With coverage
pnpm test:unit --coverage
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Run all quality checks (matches CI exactly)
./scripts/quality-check.sh

# Validate hooks match CI requirements
./scripts/validate-pre-commit.sh
```

### Quality Gates

KOMPASS enforces strict quality gates that run both locally (via git hooks) and in CI/CD. **Local hooks run the EXACT same checks as CI**, ensuring code that passes locally will pass in CI.

**Pre-Commit Checks:**

- File organization validation
- lint-staged (ESLint --fix + Prettier on staged files)
- Prettier format:check (read-only)
- TypeScript type-check
- Branch naming validation

**Pre-Push Checks:**

- Full codebase lint (no --fix, matches CI)
- Prettier format:check (read-only, matches CI)
- TypeScript type-check (matches CI)
- Unit tests with coverage thresholds (80% global, 90% services)
- Security audit (high/critical vulnerabilities)

**CI/CD Checks:**

- All pre-push checks
- Integration tests
- E2E tests
- Build verification
- Documentation guard
- Performance tests

See `.cursor/rules/quality-gates.mdc` for complete documentation.

````

### Local Docker Environment

```bash
# Start all services (CouchDB, MeiliSearch, Keycloak, backend, frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Check health
bash scripts/health-check.sh
````

## CI/CD & Deployment

### Automated Workflows

KOMPASS uses **trunk-based development** with GitHub Actions for complete CI/CD:

**Quality Gates** (on every PR to `main`):

- ✅ ESLint, Prettier, TypeScript checks
- ✅ Unit, integration, and E2E tests (75%+ coverage)
- ✅ Security scanning (Snyk, Semgrep, pnpm audit)
- ✅ Documentation validation
- ✅ Build verification

**Deployments**:

- **Staging**: Auto-deploy on push to `main` branch (trunk-based)
- **Production**: Tag-triggered deployment (push tag `v*.*.*` to trigger)

**Deployment Targets**: Hetzner Cloud servers (EU region, GDPR compliant)

**See**: `docs/deployment/DEPLOYMENT_GUIDE.md` for complete setup guide

### Deployment Commands

```bash
# Staging: Auto-deploys on merge to main
# No manual command needed - automatic via GitHub Actions

# Production: Create and push version tag
git tag v1.2.3
git push origin v1.2.3
# This triggers production deployment workflow

# Manual deployment (on Hetzner server)
cd /opt/kompass/<environment>
bash scripts/deploy-staging.sh      # Staging
bash scripts/deploy-production.sh   # Production (requires IMAGE_TAG env var)

# Run health checks
bash scripts/health-check.sh <environment>

# Rollback deployment
bash scripts/rollback.sh <environment> [backup-timestamp]
```

## Project Status

### Completed ✅

- Architecture design (95% ready)
- NFR specifications (performance, scalability, availability)
- Domain model specification
- RBAC permission matrix
- Test strategy (70/20/10 pyramid)
- API specification
- Development environment setup
- **Complete CI/CD pipeline with Docker deployment**
- **Trunk-based development workflow**
- **Tag-triggered production deployments**
- **Hetzner Cloud deployment (EU, GDPR compliant)**
- **Documentation automation**
- **Quality gates enforcement**
- **Dual-environment deployment (staging + production)**

### In Progress 🚧

- MVP implementation (CRM-Basis)
- Offline sync implementation
- RBAC guards
- GoBD compliance implementation

### Planned 📋

- Keycloak integration
- MeiliSearch full-text search
- n8n workflow automation
- Mobile app optimization
- Lexware integration (Phase 2)

## Documentation

### Essential Reads

1. **Start Here:** `docs/reviews/START_HERE.md`
2. **Executive Summary:** `docs/reviews/EXEC_SUMMARY.md`
3. **Architecture:** `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
4. **Data Model:** `docs/reviews/DATA_MODEL_SPECIFICATION.md`
5. **Test Strategy:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md`

### For Developers

- **Development Workflow:** `docs/processes/DEVELOPMENT_WORKFLOW.md` ⭐ **NEW**
- **Quick Start (CI/CD):** `docs/deployment/QUICK_START.md` ⭐ **NEW**
- **File Organization:** `docs/processes/FILE_ORGANIZATION_ENFORCEMENT.md` ⭐ **NEW**
- **Development Guide:** `docs/guides/DEVELOPMENT.md`
- **Contributing:** `CONTRIBUTING.md`
- **Coding Standards:** `docs/guides/CODING_STANDARDS.md`
- **API Reference:** http://localhost:3000/api (when running)

### For DevOps

- **Deployment Guide:** `docs/deployment/DEPLOYMENT_GUIDE.md` ⭐ **NEW**
- **GitHub Secrets:** `docs/deployment/GITHUB_SECRETS.md` ⭐ **NEW**
- **Rollback Procedures:** `docs/deployment/ROLLBACK_PROCEDURES.md` ⭐ **NEW**

### By Role

- **Product Owner:** See `docs/product-vision/`
- **Tech Lead:** See `docs/architectur/` and `docs/reviews/`
- **QA Lead:** See `docs/reviews/TEST_STRATEGY_DOCUMENT.md`
- **Security:** See `docs/reviews/NFR_SPECIFICATION.md` §15
- **DevOps:** See `docs/deployment/` ⭐ **NEW**

## Team

### Roles

- **ADM** (Außendienst) - Sales field representatives
- **INNEN** (Innendienst) - Inside sales and quoting
- **PLAN** (Planungsabteilung) - Project planning and execution
- **BUCH** (Buchhaltung) - Accounting and invoicing
- **GF** (Geschäftsführer) - Executive management
- **ADMIN** - System administrators

See `docs/reviews/RBAC_PERMISSION_MATRIX.md` for complete permission matrix.

## Contributing

Please read `CONTRIBUTING.md` for:

- Development workflow
- Git commit conventions
- Code review process
- Testing requirements

## License

Proprietary - Internal use only

## Support

For questions and support:

- Technical issues: See `docs/reviews/OPERATIONS_GUIDE.md`
- Architecture questions: Refer to `docs/architectur/`
- Product questions: See `docs/product-vision/`

---

**Built with ❤️ for efficient, transparent, and customer-focused project management**
