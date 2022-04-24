module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  rules: {
    'no-console': 'off',
    'no-plusplus': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'linebreak-style': ['error', 'unix'],
    'import/no-unresolved': 'error',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/return-await': 'off',
    "@typescript-eslint/no-explicit-any": "warn"
  },
};
