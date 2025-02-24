import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node, }}},
  pluginJs.configs.recommended,
  'plugin:prettier/recommended',
  eslintConfigPrettier,
];