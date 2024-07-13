import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    "rules": {
      '@typescript-eslint/no-explicit-any': 'off',
      // note you must disable the base rule
      // as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", // or "error"
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "parent", "sibling", "index"],
          "pathGroups": [
            {
              "pattern": "@custom-lib/**",
              "group": "external",
              "position": "after"
            }
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": {
            "order": "asc"
          },
          "newlines-between": "always"
        }
      ],
      "sort-imports": [
        "error",
        {
          "allowSeparatedGroups": true,
          "ignoreDeclarationSort": true,
        }
      ],
      "no-duplicate-imports": "error",
      "no-multiple-empty-lines": [
        "error",
        {
          "max": 1,
          "maxEOF": 0,
          "maxBOF": 0
        }
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unassigned-import": "error"
    }
  }
];
