import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  includeIgnoreFile(gitignorePath),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['**/node_modules/*', '**/*.precompiled.js']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },
  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      ...eslintConfigPrettier.rules
    }
  }
];
