// Commitlint configuration for KOMPASS
// Enforces conventional commits with Linear issue IDs
// Format: <type>(KOM-###): <subject>

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Enforce Linear issue ID in scope
    'scope-enum': [0], // Disable default scope enum
    'scope-empty': [2, 'never'], // Scope (Linear ID) is required
    'scope-case': [2, 'always', 'upper-case'], // KOM-123 format
    
    // Custom rule for Linear issue ID format
    'scope-pattern': [
      2,
      'always',
      /^KOM-\d+$/,
    ],
    
    // Type enforcement
    'type-enum': [
      2,
      'always',
      [
        'feat',      // New feature
        'fix',       // Bug fix
        'docs',      // Documentation changes
        'style',     // Code style changes (formatting, etc.)
        'refactor',  // Code refactoring
        'perf',      // Performance improvements
        'test',      // Test additions/changes
        'chore',     // Build process, dependencies, etc.
        'ci',        // CI/CD changes
        'revert',    // Revert previous commit
      ],
    ],
    
    // Subject requirements
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 100],
    
    // Header (full first line) requirements
    'header-max-length': [2, 'always', 120],
    
    // Body and footer
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    'footer-leading-blank': [2, 'always'],
  },
  
  // Custom plugins for validation
  plugins: [
    {
      rules: {
        'scope-pattern': ({ scope }) => {
          const pattern = /^KOM-\d+$/;
          const isValid = pattern.test(scope);
          
          return [
            isValid,
            `Scope must be a Linear issue ID in format KOM-###. Example: feat(KOM-123): add customer validation\n` +
            `Got: ${scope}\n` +
            `Valid format: KOM-<number> (e.g., KOM-123, KOM-456)`,
          ];
        },
      },
    },
  ],
  
  // Example valid commit messages:
  // feat(KOM-123): add customer duplicate detection
  // fix(KOM-456): correct invoice total calculation
  // docs(KOM-789): update API specification
  // refactor(KOM-234): extract RBAC logic to guard
  // test(KOM-567): add E2E tests for offline sync
  // chore(KOM-890): update NestJS to v10
  
  // Example invalid commit messages:
  // feat: add customer duplicate detection  (missing Linear ID)
  // feat(KOM123): add feature  (wrong format, missing hyphen)
  // feat(kom-123): add feature  (lowercase project prefix)
  // feat(123): add feature  (missing project prefix)
  // add feature  (missing type and scope)
  // feat(KOM-123) add feature  (missing colon)
};

