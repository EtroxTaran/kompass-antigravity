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
- **GoBD Compliant** - German tax compliance for invoices and projects
- **DSGVO/GDPR Ready** - Privacy by design
- **Role-Based Access Control** - Fine-grained permissions
- **Mobile-Optimized** - iOS and Android PWA support

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
- **CouchDB:** http://localhost:5984/_utils
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

**Quick workflow**:
```bash
# 1. Create branch for Linear issue KOM-123
git checkout -b feature/KOM-123-description

# 2. Make changes and commit
git commit -m "feat(KOM-123): add feature description"
# Pre-commit hooks run: linting, formatting, type checking

# 3. Push branch
git push origin feature/KOM-123-description
# Pre-push hooks run: unit tests, documentation checks

# 4. Create PR on GitHub
# CI/CD runs: all quality gates (11 checks)

# 5. After approval, merge to develop
# Auto-deploys to staging

# 6. QA on staging, then merge develop → main
# Auto-deploys to production
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

# Type check
pnpm type-check

# Generate API docs
pnpm generate:api-docs

# Generate changelog
pnpm changelog:generate

# All checks
pnpm lint && pnpm type-check && pnpm test:unit
```

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
```

## CI/CD & Deployment

### Automated Workflows

KOMPASS uses GitHub Actions for complete CI/CD:

**Quality Gates** (on every PR):
- ✅ ESLint, Prettier, TypeScript checks
- ✅ Unit, integration, and E2E tests (75%+ coverage)
- ✅ Security scanning (Snyk, Semgrep, pnpm audit)
- ✅ Documentation validation
- ✅ Build verification

**Deployments**:
- **Staging**: Auto-deploy on merge to `develop`
- **Production**: Auto-deploy on merge to `main`

**See**: `docs/deployment/QUICK_START.md` for setup guide

### Deployment Commands

```bash
# Deploy to staging (on server)
bash scripts/deploy-staging.sh

# Deploy to production (on server)
bash scripts/deploy-production.sh

# Run health checks
bash scripts/health-check.sh <environment>

# Rollback deployment
bash scripts/rollback.sh <environment>
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
