module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     // Test additions/changes
        'build',    // Build system changes
        'ci',       // CI configuration changes
        'chore',    // Other changes that don't modify src or test files
        'revert',   // Revert a previous commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'backend',
        'frontend',
        'shared',
        'customer',
        'contact',
        'opportunity',
        'offer',
        'project',
        'task',
        'invoice',
        'payment',
        'protocol',
        'auth',
        'sync',
        'search',
        'workflow',
        'config',
        'deps',
        'docs',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};

