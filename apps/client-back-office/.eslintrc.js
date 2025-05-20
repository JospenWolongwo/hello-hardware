module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*', 'dist/**/*', '.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        require.resolve('@hellocomputing/base-eslint'),
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        'max-params': 0,
        '@typescript-eslint/consistent-type-imports': 0,
        '@angular-eslint/no-empty-lifecycle-method': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};
