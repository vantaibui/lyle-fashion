# Testing strategy

## Layers

- Vitest: pure logic, formatting, validation, adapters, and hooks.
- React Testing Library: component behavior through accessible user-facing queries.
- Storybook: isolated component states and automated accessibility checks.
- Playwright: critical user journeys in supported desktop and mobile profiles once those journeys exist.

Tests should assert behavior, not implementation detail. Mock at external boundaries and keep fixtures minimal and explicit. Unit tests run in `pnpm validate`; Storybook and production builds are separate Phase 01 release checks. Coverage reports inform gaps but no numeric threshold is invented before meaningful application code exists.
