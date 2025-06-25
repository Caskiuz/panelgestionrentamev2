import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // Ignorar la carpeta dist
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Soporte para ES2020
      globals: globals.browser, // Variables globales del navegador
      parserOptions: {
        ecmaVersion: 'latest', // Última versión ECMAScript para parsing
        ecmaFeatures: { jsx: true }, // Soporte JSX
        sourceType: 'module', // Módulos ES
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // Reglas recomendadas ESLint base
      ...reactHooks.configs.recommended.rules, // Reglas recomendadas react-hooks
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Ignora variables no usadas que comienzan con mayúscula o _
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
