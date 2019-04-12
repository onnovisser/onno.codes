module.exports = {
  root: true,
  extends: ['react-app'],
  env: {
    browser: true,
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: ['react'],
  globals: {},
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  rules: {
    'no-await-in-loop': 'error',
    'consistent-return': 'error',
    'no-param-reassign': 'error',
    'prefer-template': 'warn',

    'react/no-unused-state': 'warn',
    'react/prefer-stateless-function': 'warn',
  },
};
