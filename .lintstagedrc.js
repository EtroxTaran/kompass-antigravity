module.exports = {
  '*.{ts,tsx}': [
    // Type-check using root tsconfig which uses project references
    // This will automatically check affected packages via TypeScript project references
    'pnpm exec tsc --noEmit',
    'eslint --fix',
    'prettier --write',
  ],
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
