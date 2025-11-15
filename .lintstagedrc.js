module.exports = {
  '*.{ts,tsx}': [
    // Skip type-check in lint-staged (use project-specific type-check via turbo)
    // Type-check runs in CI/CD pipeline for full project validation
    // 'pnpm type-check' requires project references which lint-staged doesn't handle well
    'eslint --fix',
    'prettier --write',
  ],
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
