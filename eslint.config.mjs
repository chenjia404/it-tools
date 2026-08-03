import antfu from '@antfu/eslint-config';
import autoImport from './.eslintrc-auto-import.json' with { type: 'json' };

export default antfu(
  {
    unocss: true,
    stylistic: {
      semi: true,
    },
  },
  {
    languageOptions: {
      globals: autoImport.globals,
    },
  },
  {
    rules: {
      'curly': ['error', 'all'],
      'ts/no-use-before-define': ['error', { allowNamedExports: true, functions: false }],
      'vue/no-empty-component-block': ['error'],
      'no-restricted-imports': ['error', {
        paths: [{
          name: '@vueuse/core',
          importNames: ['useClipboard'],
          message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
        }],
      }],
      'unused-imports/no-unused-vars': ['error', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
      }],
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-obscure-range': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'regexp/no-empty-alternative': 'off',
      'regexp/no-potentially-useless-backreference': 'off',
    },
  },
  {
    files: ['**/*.e2e.spec.ts'],
    rules: {
      'unicorn/prefer-dom-node-text-content': 'off',
    },
  },
);
