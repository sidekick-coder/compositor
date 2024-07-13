import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";


export default tsEslint.config(
    pluginJs.configs.recommended,
    ...tsEslint.configs.recommended,
    { languageOptions: { globals: globals.node } },
    { files: ["packages/**/**/*.ts"] },
    { ignores: ['packages/**/dist'] },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        }
    }
);