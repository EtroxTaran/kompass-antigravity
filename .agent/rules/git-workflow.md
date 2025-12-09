# Git & Workflow Rules

## Branching

- **Format**: `<type>/KOM-###-<description>`
- **Types**: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `test`, `chore`.
- **Strategy**: Trunk-Based Development. Short-lived branches merge to `main`.

## Commits

- **Format**: Conventional Commits `<type>(KOM-###): <subject>`.
- **Link**: ALWAYS reference the Linear issue ID.

## Pull Requests

- **Quality Gates**: Lint, Format, Types, Tests, Build must pass.
- **Review**: At least 1 approval required. All conversations resolved.
