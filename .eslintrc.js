module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-newline': 'off',
    'linebreak-style': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'prettier/prettier': [
      'error',
      { semi: true, trailingComma: 'es5', endOfLine: 'auto', printWidth: 100 },
    ],
    'operator-linebreak': 'off',
    'no-underscore-dangle': 'off',
    'implicit-arrow-linebreak': 'off',
    'comma-dangle': 0,
    'function-paren-newline': 0,
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
