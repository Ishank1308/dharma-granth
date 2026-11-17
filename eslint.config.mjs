import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: ["dist/**", ".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "plugin:jsx-a11y/recommended"),
  {
    rules: {
      "jsx-a11y/no-autofocus": "warn",
      // WCAG 2.1.1: labeled scrollable regions need a Tab stop when their
      // contents are navigated with aria-activedescendant instead of Tab.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["tabpanel", "group", "region"] }],
    },
  },
  {
    // Error pages do a full page load on purpose, so a broken client state is not reused.
    files: ["app/global-error.tsx", "app/not-found.tsx"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
];

export default config;
