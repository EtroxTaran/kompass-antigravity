You are a senior full-stack engineer in Cursor 2.0.

Your single job in this run:  
**Perform every pre-check locally that our CI/CD pipeline will run, fix all issues, and leave the repository in a state that is 100% ready to be committed, pushed, and used to open a green Pull Request.**

This is a _pre-commit / pre-push safety gate_, not a feature implementation.

---

## 1. Understand All Checks CI/CD Runs

1. Use **Ref MCP** (and GitHub MCP if available) to:
   - Inspect our CI/CD configuration (GitHub Actions workflows, scripts, etc.).
   - Identify **every check** that runs in CI/CD, including:
     - Linting (ESLint or similar)
     - Formatting (Prettier or other tools)
     - Type checking (TypeScript or others)
     - Unit tests
     - Integration tests
     - E2E tests (if configured)
     - Static analysis / security (e.g. Semgrep, dependency checks)
     - Documentation checkers / doc guards
     - Build / bundler checks
   - Create a short internal list of all commands and tools that must be executed locally to mirror CI/CD as closely as possible.

2. If there are separate “pre-commit” / “pre-push” tools (husky, lint-staged, etc.):
   - Include those in the execution plan as well.

---

## 2. Run All Pre-Checks Locally

Execute **all** of the identified checks locally, in a sensible order (e.g. format → lint → typecheck → tests → docs → build), including at least:

- Prettier/formatter
- Linters (ESLint, etc.)
- Type checking
- Unit tests
- Integration tests
- E2E tests (if configured)
- Static analysis / security scans
- Documentation checker(s)
- Build / bundler verification if CI does it
- Any custom project-specific quality gates

**Important:**

- Ensure each command actually completes and does not hang.
- Ensure test commands are run with the correct flags so the process exits and reports success/failure properly.

---

## 3. Fix Everything Until All Checks are Green

For **every failure or warning** that would cause CI/CD to fail:

1. Identify the root cause.
2. Fix the underlying issue in the code, tests, docs, config, or scripts.
3. Re-run the _relevant_ checks to confirm they now pass.
4. Repeat as needed until **all checks are green**.

Priorities:

- Do not just silence warnings; fix them according to our conventions.
- Respect project rules for:
  - ESLint
  - Prettier
  - TypeScript
  - Test structure and naming
  - Documentation formats and “doc guards”

If you discover misconfigurations (e.g. a doc checker that is unrealistic or incorrectly set up), do **not** remove the check in this prompt. Instead:

- Fix what you can locally.
- Note any structural issues in a short summary so they can be addressed separately.

---

## 4. Verify Readiness for Commit / Push / PR

At the end, verify ALL of the following:

- [ ] Working tree has no broken formatting (Prettier clean).
- [ ] All lint checks pass.
- [ ] All type checks pass.
- [ ] All unit/integration/E2E tests that CI runs are passing.
- [ ] Static analysis / security checks pass.
- [ ] Documentation guards/checkers pass.
- [ ] Build/bundle command (if any) passes.
- [ ] No command hangs; all produce clear success status.

If anything is still failing, **continue fixing and re-running** until everything is green.

---

## 5. Final Output

When you’re done, provide a **short summary** with:

- A checklist of which commands/checks were run.
- Which issues were found and how they were fixed.
- Any remaining structural problems in the tooling/config that cannot be fixed in this run (if any).
- A final statement explicitly confirming that:
  > “The repository is in a state that is ready to be committed, pushed, and used to create a PR, and all local checks that mirror CI/CD are passing.”

Do **not** create commits, push, or open a PR in this prompt.  
Your only responsibility here is to leave the codebase **fully clean and CI-ready**.
