// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("@angular-eslint/eslint-plugin");
const angularTemplatePlugin = require("@angular-eslint/eslint-plugin-template");
const tsParser = require("@typescript-eslint/parser");
const angularTemplateParser = require("@angular-eslint/template-parser");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },

    plugins: {
      "@angular-eslint": angular,
      "@typescript-eslint": tseslint.plugin,
    },

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylistic,
      eslintPluginPrettierRecommended
    ],

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
        "warn",
        {
          type: "element",
          prefix: ["app", "jsonforms"],
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "prettier/prettier": ["error", {
        singleQuote: true,
        semi: false,
        trailingComma: "all",
        quoteProps: "preserve",
      }],
    },
  },
  {
    files: ["src/**/*.spec.ts"],
    
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
    },

    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    files: ["**/*.html"],
    
    languageOptions: {
      parser: angularTemplateParser,
    },

    plugins: {
      "@angular-eslint/template": angularTemplatePlugin,
    },

    extends: [
      eslintPluginPrettierRecommended
    ],

    rules: {
      "prettier/prettier": ["error", {
        parser: "angular",
      }]
    },
  }
);
