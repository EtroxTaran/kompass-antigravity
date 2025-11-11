# Changelog

All notable changes to the KOMPASS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete CI/CD pipeline with GitHub Actions
- Docker infrastructure for containerized deployment
- Automated quality gates (linting, type checking, testing, security)
- Documentation automation and validation
- Dual-environment deployment (staging + production)
- Automatic rollback on deployment failure
- Comprehensive health checks
- Linear issue integration in commits and branches
- Conventional commits enforcement
- API documentation generator
- Changelog automation from commits

### Infrastructure
- Multi-stage Dockerfiles for backend (NestJS) and frontend (React+nginx)
- docker-compose configurations for development, staging, and production
- Deployment scripts with health checks and rollback support
- Pre-commit hooks (linting, formatting, type checking)
- Pre-push hooks (unit tests, branch validation, documentation checks)

### Documentation
- Deployment Guide with step-by-step instructions
- GitHub Secrets Reference
- Rollback Procedures
- Development Workflow guide
- Quick Start guide for first-time setup

### Security
- Security headers in nginx configuration
- Non-root Docker containers
- Automated security scanning (Snyk, Semgrep, pnpm audit)
- Secret management via GitHub Secrets
- Environment isolation

---

## [1.0.0] - 2025-01-27

### Added
- Initial project structure
- Monorepo setup with pnpm workspaces
- NestJS backend foundation
- React PWA frontend foundation
- Shared package for common code
- Test framework (Jest + Playwright)
- Linting and formatting setup
- Documentation structure

---

## How to Update This Changelog

This changelog is automatically updated by the CI/CD pipeline when changes are merged.

### Manual Updates

If you need to manually add an entry:

```bash
# Run the changelog generator
pnpm changelog:generate

# Or manually edit this file following Keep a Changelog format
```

### Automatic Updates

The changelog is automatically updated when:
- PRs are merged to `develop` (added to Unreleased section)
- PRs are merged to `main` (new version created)

### Commit Types

- `feat`: Added features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test updates
- `chore`: Build/tooling updates

---

[Unreleased]: https://github.com/your-org/kompass/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-org/kompass/releases/tag/v1.0.0

