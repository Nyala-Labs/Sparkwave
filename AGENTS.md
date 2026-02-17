Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

# AGENTS.md

## Purpose
- This file describes how to work in this repo as an agent.
- Keep it current as commands, tooling, or conventions change.

## Cursor and Copilot rules
- No .cursor/rules/ or .cursorrules were found.
- No .github/copilot-instructions.md was found.

## Project overview
- Next.js App Router project.
- TypeScript strict mode is enabled.
- Tailwind CSS v4 with DaisyUI plugin.
- Drizzle ORM with PostgreSQL (neon-http).
- Local envs are loaded from `.env` for tooling.

## Key paths
- `app/` App Router pages and layouts.
- `app/globals.css` Tailwind, DaisyUI, and theme tokens.
- `db/drizzle.ts` Drizzle client setup (neon-http).
- `db/schema/*` Database schema definitions.
- `drizzle.config.ts` Drizzle Kit config.
- `types.d.ts` Global type declarations (currently empty).

## Package manager
- `bun.lock` exists; prefer Bun when adding deps.
- If you use npm, do not delete or rewrite `bun.lock`.

## Commands
- Install deps: `bun install` (preferred) or `npm install`.
- Dev server: `npm run dev` (Bun also supports `bun dev`).
- Build: `npm run build`.
- Start: `npm run start`.
- Lint: `npm run lint`.
- Typecheck: `npx tsc -p tsconfig.json --noEmit`.
- Fix lint issues: `npm run lint -- --fix`.

## Tests
- No test runner or test scripts are configured.
- There is no single-test command yet.
- If you add tests, add `test` and `test:single` scripts and update this file.

## Environment
- Local env file: `.env` (do not commit).
- Required: `DATABASE_URL` for Drizzle.
- Prefer explicit runtime checks for env vars in new code.

## Code style basics
- Language: TypeScript with strict mode on.
- Indentation: 2 spaces.
- Quotes: double quotes in TS/JS; template strings only when needed.
- Semicolons: required.
- Trailing commas in multi-line literals.
- Line length: keep readable; break long JSX props or objects.
- ESLint (eslint-config-next) is the authority.

## Imports
- Order: built-ins, external packages, internal alias (`@/`), relative, styles.
- Use `import type` for type-only imports.
- Prefer named exports for shared modules.
- Default exports are fine for Next pages/layouts.
- Use path alias `@/` for root imports when practical.

## Naming
- Components: PascalCase.
- Hooks: `useX`.
- Functions/vars: camelCase.
- Constants: SCREAMING_SNAKE_CASE for true constants.
- Files: follow Next.js conventions (`page.tsx`, `layout.tsx`, etc.).
- Schema tables: plural SQL table names; camelCase in TS.

## Types and interfaces
- Prefer type aliases for unions and function signatures.
- Prefer interfaces for object shapes meant to be extended.
- Avoid `any`; use `unknown` and narrow.
- Exported functions should have explicit return types when non-trivial.
- Keep React props typed and minimal.

## React and Next.js conventions
- Use Server Components by default; add "use client" only when needed.
- Keep side effects in client components or server actions.
- Use `next/image` for images.
- Update `metadata` in `app/layout.tsx` for defaults.
- Keep layout/page components as pure as possible.
- Prefer `app/api/*` route handlers for server endpoints.

## Styling
- Use Tailwind utility classes for layout and spacing.
- Use DaisyUI components where it keeps markup concise.
- Put global theme tokens in `app/globals.css`.
- Avoid custom CSS unless it is shared or not expressible in Tailwind.

## Database and Drizzle
- Schema files live in `db/schema`.
- Reuse helpers (e.g., `timestamps`) across tables.
- The DB uses snake_case; Drizzle config maps casing.
- Fail fast on missing DB config.
- Keep queries close to the feature that uses them.

## Error handling
- Prefer early returns and clear messages.
- Throw errors for programmer mistakes or missing config.
- Handle user-facing errors with friendly UI states.
- Avoid swallowing errors; log with context on the server.

## Formatting JSX
- Keep className strings ordered by layout, spacing, color, typography, state.
- Split large JSX blocks into smaller components.
- Wrap long prop lists across lines, one prop per line.

## Linting expectations
- Fix ESLint warnings before pushing.
- Keep unused vars/imports out of the codebase.
- Avoid `eslint-disable` unless scoped and justified.

## Repository hygiene
- Do not commit secrets or `.env`.
- Keep generated files out of version control unless required.
- Update this file when build/test/lint commands change.

## When using Context7 MCP
- Use it for library/API docs and code generation steps.
- Cite the exact library and version you queried.
- Prefer official docs in the response.

## Additions for new tooling
- If you add a test runner, update commands and add a single-test example.
- If you add formatting (Prettier/biome), document the canonical formatter.
- If you add CI, document local equivalents.

## Example single-test placeholders (update when tests exist)
- Example (Vitest): `npx vitest run path/to/file.test.ts`.
- Example (Jest): `npx jest path/to/file.test.ts`.
- Example (Playwright): `npx playwright test path/to/spec.ts`.
- These are placeholders; align to the chosen runner.
