module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'scope-enum': [0],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'upper-case'],
    'scope-pattern': [2, 'always', /^KOM-\d+$/],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 200],
    'footer-leading-blank': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'scope-pattern': ({ scope }) => {
          const pattern = /^KOM-\d+$/;
          const isValid = pattern.test(scope);
          return [
            isValid,
            `Scope must be Linear issue ID (KOM-###). Got: ${scope || 'empty'}`,
          ];
        },
      },
    },
  ],
};
