# CI/CD Pipeline & Quality Gates

**Last Updated:** 2025-11-14  
**Owners:** DevOps + Engineering Leads  
**Workflows:**

- Primary CI: `.github/workflows/ci.yml`
- Security Scans: `.github/workflows/security.yml`

---

## 1. Overview

The CI/CD system enforces the Definition of Done for every pull request and automatically publishes artifacts on `main`. Each workflow is deterministic, cancellable (per-branch concurrency), and aligned with the NFR requirements defined in `docs/specifications/nfr-specification.md`.

| Scenario                     | Workflow                                        | Outcome                                                                                 |
| ---------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| PR quality verification      | `ci.yml` (pull_request + push)                  | Runs all quality gates in parallel and blocks merges if any job fails                   |
| Nightly/adhoc security scans | `security.yml` (schedule + manual)              | Performs dependency review, `pnpm audit`, `pnpm outdated`, and Semgrep SAST             |
| Artifact publication         | `ci.yml` (`push` to `main` after quality gates) | Builds and pushes backend/frontend Docker images to GHCR with semantic tags and digests |

---

## 2. CI Job Matrix (`ci.yml`)

| Job                    | Command                                                                                              | Purpose                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `lint`                 | `pnpm lint`                                                                                          | ESLint (zero warnings allowed)                                                                             |
| `format-check`         | `pnpm format:check`                                                                                  | Prettier enforcement                                                                                       |
| `type-check`           | `pnpm type-check`                                                                                    | TypeScript compilation for all workspaces                                                                  |
| `unit-tests`           | `pnpm test:unit --coverage`                                                                          | Jest/Vitest unit suite + Codecov upload (Global ≥80% enforced via `jest.config.js`)                        |
| `integration-tests`    | `pnpm test:integration`                                                                              | Backend integration tests with CouchDB + Meilisearch services                                              |
| `e2e-tests`            | `pnpm test:e2e`                                                                                      | Playwright chromium/firefox/webkit matrix (artifacts uploaded even on failure)                             |
| `build`                | `pnpm build`                                                                                         | Turbo build to catch compile errors early                                                                  |
| `documentation`        | `.github/scripts/check-docs-update.sh`, `markdown-link-check`, `pnpm run generate:api-docs`          | Ensures docs are updated when code changes require it                                                      |
| `commit-message-check` | Regex scan                                                                                           | Validates `type(KOM-###): subject` format                                                                  |
| `branch-name-check`    | Regex scan                                                                                           | Enforces `<type>/KOM-###-description` branch naming                                                        |
| `root-directory-check` | `.github/scripts/check-root-directory.sh`                                                            | Prevents forbidden files in repo root                                                                      |
| `security-audit`       | `pnpm audit --audit-level=high`, Semgrep (`p/security-audit`, `p/typescript`, `p/react`, `p/nodejs`) | Blocks PR when high-severity issues appear                                                                 |
| `performance-tests`    | `pnpm test:performance`                                                                              | Autocannon-based regression harness tied to NFR thresholds                                                 |
| `quality-gate`         | Summary shell script                                                                                 | Fails PR if any upstream job failed and prints a remediation list                                          |
| `docker-images`        | `docker/build-push-action` (main only)                                                               | Pushes `ghcr.io/<repo>/backend` and `/frontend` images with ref/semver/sha tags and stores digests in logs |

**Performance Regression Harness:**  
`tests/performance/performance-regression.test.ts` spins up a deterministic mock API and runs `autocannon` for 10 seconds. Failures occur when:

- `p50 > 400 ms`
- `p97.5 > 1500 ms`
- `p99 > 2500 ms`
- Average throughput `< 200 req/s`

Results are saved in `tests/performance/.artifacts/summary.json` (git-ignored, uploaded in CI for debugging).

---

## 3. Security Workflow (`security.yml`)

| Job                 | Trigger           | Description                                                                                                                               |
| ------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `dependency-review` | PR-only           | Uses `actions/dependency-review-action@v4` to block unsafe upgrades                                                                       |
| `pnpm-audit`        | schedule + manual | Installs dependencies with `pnpm install --frozen-lockfile`, runs `pnpm audit --audit-level=high`, and prints `pnpm outdated --recursive` |
| `semgrep`           | schedule + manual | Executes Semgrep with the same rule packs as CI and uploads SARIF via `github/codeql-action/upload-sarif@v2`                              |

Cron schedule: `0 2 * * *` (daily at 02:00 UTC). Use **Run workflow** in GitHub Actions for ad-hoc scans.

---

## 4. Docker Artifact Strategy

| Image                            | Tags                                                       | Location                        |
| -------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| Backend (`Dockerfile.backend`)   | `main`, PR ref, semantic version (from tags), `main-<sha>` | `ghcr.io/<org>/<repo>/backend`  |
| Frontend (`Dockerfile.frontend`) | same as backend                                            | `ghcr.io/<org>/<repo>/frontend` |

Each build uses multi-stage Dockerfiles at the repo root:

- Builder stage installs dependencies via pnpm, builds shared + target workspace.
- Runtime stage uses `node:20-alpine` (backend) or `nginx:1.25-alpine` (frontend), runs as non-root, sets health checks, and uses `dumb-init`.
- Ci job logs the final image digests for downstream deployment workflows (`deploy-staging.yml`, `deploy-production.yml`).

---

## 5. Running Checks Locally

| Concern     | Command                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ESLint      | `pnpm lint`                                                                                                                                |
| Prettier    | `pnpm format:check` / `pnpm format`                                                                                                        |
| Types       | `pnpm type-check`                                                                                                                          |
| Unit        | `pnpm test:unit --coverage`                                                                                                                |
| Integration | `pnpm test:integration` (requires running CouchDB + Meilisearch; reuse `docker-compose.yml`)                                               |
| E2E         | `pnpm test:e2e` (runs Playwright)                                                                                                          |
| Performance | `pnpm test:performance`                                                                                                                    |
| Security    | `pnpm audit --audit-level=high` and `pnpm exec semgrep --config p/security-audit --config p/typescript --config p/react --config p/nodejs` |
| Docs        | `bash .github/scripts/check-docs-update.sh`                                                                                                |

> **Tip:** Use `act pull_request` for a fast dry-run of most CI jobs. Performance tests and Semgrep require networking permissions.

---

## 6. Troubleshooting Guide

| Failure                            | Resolution Steps                                                                                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `quality-gate` fails with job list | Inspect the failing job logs (they are linked in the summary). Re-run only the failed jobs by pushing fixes; rerun workflow if necessary using the GitHub Actions UI.                  |
| `documentation` job fails          | Run `bash .github/scripts/check-docs-update.sh` locally and update the relevant files (`docs/api`, `docs/architecture`, guides). Don’t forget to commit regenerated API docs.          |
| `performance-tests` fails          | Run `pnpm test:performance` locally. Investigate `tests/performance/.artifacts/summary.json` for the latest sample and profile the offending code path (usually synchronous hotspots). |
| `security-audit` fails (pnpm)      | Update vulnerable packages or document a justified mitigation. High severity issues cannot be waived without a DevSecOps approval.                                                     |
| `security-audit` fails (Semgrep)   | Address the finding; if it’s a false positive, suppress it with inline comments referencing the Linear issue.                                                                          |
| `docker-images` job blocked        | Ensure the workflow ran on `main`, all quality gates are green, and container registry permissions (`packages: write`) remain intact.                                                  |

---

## 7. Adding / Modifying Quality Gates

1. Update `.github/workflows/ci.yml` with the new job.
2. Add the job identifier to the `needs` list in `quality-gate`.
3. Document the change here and in `docs/processes/README.md`.
4. Ensure local commands are added to the table in section 5.
5. Communicate the change in Slack + Linear.

---

## 8. References

- **CI Workflow:** `.github/workflows/ci.yml`
- **Security Workflow:** `.github/workflows/security.yml`
- **Dockerfiles:** `Dockerfile.backend`, `Dockerfile.frontend`
- **NFR Targets:** `docs/specifications/nfr-specification.md`
- **Testing Strategy:** `docs/specifications/test-strategy.md`
- **Development Workflow:** `docs/processes/DEVELOPMENT_WORKFLOW.md`
