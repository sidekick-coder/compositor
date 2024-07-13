import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";


export default tsEslint.config(
    pluginJs.configs.recommended,
    ...tsEslint.configs.recommended,
    { languageOptions: { globals: globals.node } },
    {
        files: ["packages/core/**/*.ts"],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        }
    }
);