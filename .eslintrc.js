module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  extends: [require.resolve('@hellocomputing/base-eslint')],
  ignorePatterns: ['.eslintrc.js'],
  env: {
    node: true,
    jest: true,
  },
};
