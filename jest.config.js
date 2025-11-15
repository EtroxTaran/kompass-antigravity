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
  ],
  coverageThreshold: {
    global: {
      // Quality standards: These thresholds enforce good testing practices
      // If coverage is below these, CI will fail to encourage test writing
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './apps/backend/src/modules/*/services/*.ts': {
      // Business logic services require higher coverage
      // Services contain critical business rules and need comprehensive testing
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
