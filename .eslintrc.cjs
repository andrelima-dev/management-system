module.exports = {
  extends: ['@jungle/eslint-config'],
  ignorePatterns: ['node_modules', 'dist', 'build'],
  parserOptions: {
    tsconfigRootDir: __dirname
  }
};
