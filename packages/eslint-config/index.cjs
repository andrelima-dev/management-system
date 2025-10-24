module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    es2022: true,
    node: true,
    browser: true
  },
  parserOptions: {
    project: null,
    sourceType: 'module'
  },
  ignorePatterns: ['dist/**', 'build/**', 'coverage/**']
};
