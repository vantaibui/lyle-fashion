# Frontend project rules

## Code

- Strict TypeScript is mandatory; do not silence errors with `any` or unchecked assertions.
- Use the `@/` alias for cross-directory imports and relative imports within a cohesive local unit.
- Use named exports except where Next.js requires default exports.
- Keep files single-purpose; split by behavior and ownership, not arbitrary line counts.
- Do not add speculative helpers, barrels, state libraries, or framework wrappers.
- Keep products, variants, categories, prices, promotions, and collections out of JSX and fixtures unless a test explicitly owns the data.

## Quality gate

`pnpm validate` runs formatting, linting, type checking, and unit tests in that order. Build-affecting work also requires production and Storybook builds. End-to-end tests are required once an approved user journey exists.

## Dependencies and commits

Use pnpm exclusively and keep one `pnpm-lock.yaml`. Explain new production dependencies. The pre-commit hook formats and lints staged supported files; CI remains the authoritative gate once configured.

`lint-staged` is pinned to 16.4.0 because 17.0.8 requires Node 22.22.1 or newer while the approved local foundation runtime is Node 22.18.0. Reassess this pin when the runtime baseline is upgraded.

TypeScript 5.9.3 and ESLint 9.39.5 are the newest compatible stable lines at setup time. TypeScript 6/7 and ESLint 10 exceed peer ranges declared by the current Next.js, Storybook, and ESLint plugin toolchain; strict peer enforcement remains enabled.
