// @ts-check

import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import vitest from "eslint-plugin-vitest";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["postcss.config.cjs"],
  },
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended
  ),
  {
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/jsx-uses-react": 0,
      "react/react-in-jsx-scope": 0,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["__tests__/**"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
