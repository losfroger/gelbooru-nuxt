module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },

  plugins: ['tailwindcss'],

  extends: [
    'eslint:recommended',
    'plugin:tailwindcss/recommended',
    '@nuxt/eslint-config'
  ],

  settings: {
    tailwindcss: {
      config: 'tailwind.config.cjs'
    }
  },

  globals: {
    $nuxt: true
  },

  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },

  rules: {
    semi: ['error', 'never'],
    'vue/multi-word-component-names': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'tailwindcss/no-custom-classname': 'off'
  }
}
