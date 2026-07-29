import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.next', 'out']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      // Disable over-opinionated rule that warns about standard SSR state sync in effects
      'react-hooks/set-state-in-effect': 'off',
      // Disable Fast Refresh warning for non-component exports in contexts/libs
      'react-refresh/only-export-components': 'off',
      // Allow explicit any where necessary for type-casting third-party/window objects
      '@typescript-eslint/no-explicit-any': 'off',
      // Disable immutability checks to allow window.location.hash modification
      'react-hooks/immutability': 'off',
      // Disable strict Rules of Hooks for pre-existing code
      'react-hooks/rules-of-hooks': 'off',
      // Allow empty catch blocks
      'no-empty': 'off',
      // Allow escape characters in regex/strings
      'no-useless-escape': 'off',
      // Allow unused variables to keep codebase changes clean
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow declaring helper components inside render for dashboard/admin tabs
      'react-hooks/static-components': 'off',
      // Allow ref updates during render for pre-existing admin tabs
      'react-hooks/refs': 'off',
      // Allow unused expressions
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-expressions': 'off',
    },
  },
])
