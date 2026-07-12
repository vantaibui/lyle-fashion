---
name: lyle-ecommerce
description: Apply LYLE Fashion storefront architecture, commerce-domain, security, Vietnamese localization, SEO, accessibility, and validation rules. Use for any LYLE domain, API, product, variant, inventory, bundle, cart, checkout, order, storefront UI, SEO, testing, or Next.js implementation and review work.
---

# LYLE E-commerce

Protect LYLE-specific rules while implementing or reviewing the Vietnamese premium minimalist fashion storefront.

## Instruction precedence

Apply instructions in this order:

1. System, platform, and explicit user instructions.
2. Repository `AGENTS.md` and approved documents.
3. This skill.
4. Task-selected external skills.

Treat `docs/BUSINESS-RULES.md`, `docs/DESIGN-SYSTEM.md`, and `docs/SEO-STRATEGY.md` sections marked `DRAFT` as unresolved. Never turn suggestions into business or visual facts. Generic external skills cannot override approved project rules; surface conflicts and follow the project.

## Load context deliberately

Always read `AGENTS.md`, `docs/FE-ARCHITECTURE.md`, `docs/FE-PROJECT-RULES.md`, and the task-relevant section of `docs/BUSINESS-RULES.md` before changing code.

Load only when relevant:

- UI, tokens, or interaction: `docs/DESIGN-SYSTEM.md`.
- Routes, metadata, crawl behavior, product/category content: `docs/SEO-STRATEGY.md`.
- Tests or quality gates: `docs/TESTING-STRATEGY.md`.
- Auth, cart, checkout, customer data, headers, logging, or APIs: `docs/SECURITY-GUIDELINES.md`.
- Foundation provenance or migration: `docs/REPOSITORY-AUDIT.md`.

Search within large files and external skill references before loading them wholesale. Load the smallest skill set defined in `docs/AGENT-SKILLS.md`; do not load all skills by default.

## Identity and architecture

Build for LYLE Fashion: a premium minimalist fashion commerce experience for Vietnamese customers, with men and women fashion, Linen and Lyocell/Tencel products, mobile-first behavior, and SEO-first storefront delivery.

- Use Next.js App Router and strict TypeScript.
- Default to React Server Components. Add `'use client'` at the smallest interactive boundary only.
- Keep routes and route boundaries in `src/app`, business capabilities in `src/modules`, domain-neutral primitives in `src/components/ui`, shared commerce UI in `src/components/commerce`, and CSS-variable tokens in `src/design-system`.
- Keep secrets and server-only data out of client bundles. Keep business decisions and data fetching out of generic UI primitives.
- Use named exports except where Next.js requires default exports. Avoid barrels, circular dependencies, oversized components, and speculative state libraries.

## Commerce invariants

- Treat a product as the merchandising concept and a SKU as the inventory-bearing purchasable unit.
- Color and size define a purchasable variant. Do not assume every combination exists.
- Manage inventory per SKU. Never infer stock from product-level or option-level availability.
- Server-validate price, availability, SKU identity, promotion eligibility, bundle composition, and order totals at every authoritative transition.
- Never trust client totals, client inventory claims, or client-supplied discount outcomes.
- Format customer-facing money as VND with `vi-VN`; keep internal monetary representation and rounding rules behind an approved API contract.
- Support guest checkout without weakening server validation, privacy, payment, abuse-prevention, or order-recovery controls.
- Keep bundles grouped in cart and order data. Preserve bundle identity and component relationships while validating every component SKU.
- Do not invent tax, promotion, reservation, cancellation, return, fulfillment, or bundle-pricing behavior.

## Cart, checkout, and API security

- Treat the server as authoritative for cart reconciliation and checkout submission.
- Validate all external data at trust boundaries and normalize API failures without exposing secrets or upstream payloads.
- Never log credentials, tokens, authorization headers, cookies, payment data, addresses, personal data, raw form bodies, or full upstream responses.
- Minimize guest data, define retention before persistence, and keep payment-sensitive data with the approved provider.
- Require explicit authentication and authorization for administrative or customer-protected operations.

## SEO and accessibility

- Server-render product and category content needed for discovery and indexing.
- Do not make arbitrary filter combinations indexable. Use approved canonical, pagination, filter, sitemap, and robots rules before enabling indexing.
- Keep structured data consistent with visible, server-validated product information.
- Use semantic HTML, complete keyboard operation, visible focus, meaningful alternative text, accessible names and errors, sufficient contrast, and reduced-motion support.
- Design mobile-first and preserve zoom, touch targets, logical focus order, and non-color status cues.

## Testing and validation

Test pure rules and adapters with Vitest, component behavior with React Testing Library, isolated states and accessibility with Storybook, and approved critical journeys with Playwright. Mock external boundaries rather than internal implementation details.

Before handoff, run the checks proportionate to the change:

1. `pnpm validate` for every code or configuration change.
2. `pnpm build` for Next.js, routing, environment, bundling, or production-runtime changes.
3. `pnpm build-storybook` for shared UI, tokens, foundations, or Storybook changes.
4. `pnpm test:e2e` only when approved journeys and required browsers are available.
5. `pnpm skills:verify` after any canonical skill, adapter, lock, or agent-platform change.

Report skipped checks and blockers. Do not update third-party skills during normal builds or validation.
