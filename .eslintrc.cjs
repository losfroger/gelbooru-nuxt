module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  plugins: ['@typescript-eslint', 'tailwindcss'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:tailwindcss/recommended',
  ],

  settings: {
    'tailwindcss': {
      'config': 'tailwind.config.cjs'
    }
  },

  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  rules: {
    semi: ['error', 'never'],
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'tailwindcss/no-custom-classname': 'off'
  },
}