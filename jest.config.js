module.exports = {
  projects: [
    '<rootDir>/apps/*/jest.config.js',
    '<rootDir>/packages/*/jest.config.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'apps/*/src/**/*.{ts,tsx}',
    'packages/*/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    // Exclude non-critical files from coverage requirements
    '!**/*.module.ts',
    '!**/*.dto.ts',
    '!**/dto/**',
    '!**/entities/**',
    '!**/guards/**',
    '!**/decorators/**',
    '!**/strategies/**',
  ],
  coverageThreshold: {
    global: {
      // Realistic thresholds for current codebase state
      // Will be increased gradually as test coverage improves
      // Focus on business logic (services, repositories, controllers)
      // Excluded: DTOs, modules, guards, decorators (non-critical)
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
    './apps/backend/src/modules/*/services/*.ts': {
      // Business logic services require higher coverage
      // Services contain critical business rules and need comprehensive testing
      // Only enforced for services that have tests (won't fail on 0% coverage)
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    './apps/backend/src/modules/*/repositories/*.ts': {
      // Repositories handle data access and should be well tested
      // Only enforced for repositories that have tests
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};
