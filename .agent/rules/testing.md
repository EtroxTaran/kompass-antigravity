# Testing Standards

## Coverage Requirements

- **Business Logic (Services)**: 90%
- **React Components**: 80%
- **Utilities**: 85%
- **Controllers**: 70%
- **Overall**: 80%

## Testing Pyramid

- **Unit Tests (70%)**: Fast, isolated, mock dependencies.
- **Integration Tests (20%)**: Test module interactions, real DB (test instance).
- **E2E Tests (10%)**: Critical user flows (Playwright).

## Guidelines

- **Mocking**: Mock external dependencies/repositories. Do NOT mock the code under test.
- **Structure**: `describe('Feature') -> describe('method') -> it('should...')`.
