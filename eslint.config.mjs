import withNuxt from './.nuxt/eslint.config.mjs'
import tailwind from 'eslint-plugin-tailwindcss'
import vue from 'eslint-plugin-vue'

export default withNuxt(
  {
    ignores: [
      '/dist',
      '/src-capacitor',
      '/src-cordova',
      '/.quasar',
      '/.nuxt',
      '/.output',
      '/node_modules',
      '.eslintrc.js',
      '/src-ssr',
      '/quasar.config.*.temporary.compiled*',
    ],
  },
  ...tailwind.configs['flat/recommended'],
  ...vue.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      'prefer-promise-reject-errors': 'off',
      eqeqeq: 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-debugger': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
        ignores: [],
      }],
      'vue/multi-word-component-names': 'off',
      indent: 'off',
      'tailwindcss/no-custom-classname': 'off',
      semi: ['error', 'never'],
    },
    settings: {
      tailwindcss: {
        config: 'tailwind.config.cjs',
      },
    },
  }
)
