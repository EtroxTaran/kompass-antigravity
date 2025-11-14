const tsProjects = [
  './tsconfig.eslint.json',
  './apps/backend/tsconfig.json',
  './apps/frontend/tsconfig.json',
  './packages/shared/tsconfig.json',
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: tsProjects,
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',

    // Import
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@kompass/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/components/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '../ui/**',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',

    // General
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    'import/ignore': ['@/components/ui/.*', '\\.\\./ui/.*'],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: tsProjects,
        tsconfigRootDir: __dirname,
      },
      alias: {
        map: [
          ['@/', './apps/frontend/src/'],
          ['@kompass/shared', './packages/shared/src'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['tests/performance/**/*.ts'],
      rules: {
        'import/no-unresolved': 'off',
        'import/no-cycle': 'off',
        'import/no-self-import': 'off',
        'import/namespace': 'off',
        'import/order': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'no-console': 'off',
      },
    },
    {
      files: [
        '**/__tests__/**/*.ts',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        'tests/**/*.ts',
        'tests/**/*.tsx',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: ['apps/frontend/src/components/**/*.{ts,tsx}'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
