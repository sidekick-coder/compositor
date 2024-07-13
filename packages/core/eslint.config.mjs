import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";


export default tsEslint.config([
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    }
  }
]);