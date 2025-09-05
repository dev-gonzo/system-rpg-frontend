// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const noComments = require("eslint-plugin-no-comments");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = tseslint.config(
  {
    ignores: [
      "projects/**/*",
      "dist/**/*",
      "coverage/**/*",
      "node_modules/**/*",
      ".angular/**/*",
      "**/*.css",
      "**/*.scss",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      "no-comments": noComments,
      "unused-imports": unusedImports,
    },
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "no-console": "error",
      "no-var": "error",
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "spaced-comment": ["error", "never"],
      "no-inline-comments": "error",
      "no-warning-comments": ["error", { "terms": ["todo", "fixme", "xxx", "hack", "bug", "note", "comment"], "location": "anywhere" }],
      "no-comments/disallowComments": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
    },
  },
  {
    files: ["**/*.css", "**/*.scss"],
    rules: {
      "spaced-comment": "off",
      "no-inline-comments": "off",
      "no-warning-comments": "off",
      "no-comments/disallowComments": "off",
    },
  }
);
