# Business rules

**Status: DRAFT — confirmed invariants and proposed rules are separated below.**

This document is the concise business-policy source. Entity structure lives in `DOMAIN-MODEL.md`, lifecycle transitions in `STATUS-TRANSITIONS.md`, and unresolved decisions in `OPEN-QUESTIONS.md`.

## Interpretation labels

- **Confirmed:** supplied by the product brief or approved repository rules.
- **Recommended MVP:** safest working policy, pending business approval.
- **Open:** no implementation authority; resolve in `OPEN-QUESTIONS.md`.

## Confirmed identity and merchandising

- LYLE Fashion serves Vietnamese customers with premium minimalist clothing for men and women.
- Core materials include Linen, Lyocell, and Tencel. Whether Tencel is represented as a trademarked Lyocell label or a separate merchandising material is open.
- Style vocabulary includes Casual, Minimal, Office, Premium, and Everyday. Taxonomy ownership and whether these are tags, categories, or collections are open.
- Customer-facing prices use VND and `vi-VN` formatting.
- Pricing references are directional, not constants or guaranteed selling prices:
  - Single products: around 399,000 VND.
  - Casual sets: around 699,000 VND.
  - Premium sets: around 1,099,000 VND.
- Product/category/collection/pricing data must come from an approved system of record, never hard-coded JSX.

## Confirmed product and inventory invariants

- A Product is a merchandising concept; a ProductVariant is a selectable color/size combination; a SKU is the purchasable inventory-bearing unit.
- Color and size define a purchasable variant. Not every color/size combination is assumed to exist.
- Inventory is managed per SKU.
- Price, availability, SKU identity, bundle composition, promotions, and final totals are server-validated.
- Client-calculated totals and client-reported stock are never authoritative.
- Product and category content needed for search discovery is server-rendered.

## Confirmed bundles

- LYLE supports casual and premium outfit bundle concepts.
- A bundle remains grouped in cart and order data.
- Every selected bundle component resolves to an actual SKU and is stock-validated independently.
- Bundle price, return treatment, promotion stacking, substitution, and partial cancellation are open.

## Recommended MVP commerce rules

The following are recommendations, not approved policy:

- Support simple products and fixed-component bundles; let customers choose an available size for each fixed component.
- Treat product variant deep links as customer convenience only. Canonical identity remains the base product route, and invalid variant links must fall back safely rather than asserting nonexistent SKUs.
- Exclude configurable mix-and-match bundles, automatic substitutions, and component quantity editing from MVP.
- Store price as integer VND minor units only after finance confirms VND rounding and tax semantics. Since VND normally displays without decimals, do not infer tax inclusion from display format.
- Revalidate cart lines on cart read, checkout start, and order submission. Return explicit line-level adjustments for stock, price, promotion, or availability changes.
- Combine duplicate simple SKU lines by quantity. Combine bundle lines only when bundle ID and all component SKU selections match.
- Never reserve stock merely by adding to cart. Reservation timing and duration are open and backend-dependent.
- Keep disabled or removed lines visible with a recovery action instead of silently deleting them.

## Recommended MVP checkout rules

- Allow guest checkout with email and/or Vietnamese phone contact, recipient name, province/city, district, ward/commune, street address, shipping selection, and optional delivery note.
- Keep address labels and administrative data provider-driven; do not hard-code Vietnamese divisions because boundaries and names may change.
- Revalidate the complete order server-side before payment or confirmation.
- Require an idempotency key for order placement and payment initiation; disable repeated UI submission while preserving safe retry.
- Keep order, payment, and fulfillment statuses independent.
- Show an order confirmation reference only after the backend has durably created the order.
- Do not store payment credentials in the storefront. COD and online payment availability remain provider/policy decisions.

## Recommended cart identity rules

- A guest cart uses an opaque, secure cart token; it must not expose customer identity or sequential IDs.
- An authenticated cart belongs to a customer account.
- Login merge should be an explicit server operation with deterministic reconciliation and a customer-visible summary of changes.
- Cart expiry duration, quantity limits, merge winner, and abandoned-cart consent are open.

## Current development-only foundation

- The local cart foundation uses an httpOnly guest token and server memory only. It exists to prove state ownership and must not be treated as approved persistence architecture.
- Duplicate simple SKU lines merge by quantity up to the local limit of 5. Bundle lines merge only when bundle identity and component SKU selections match exactly.
- Development promotion codes are deliberately non-production: `DEV10`, `DEVSHIP`, `DEVEXPIRED`, and `DEVMIN` exist only to exercise apply/remove/error states.
- The current checkout foundation exposes COD and one development-only online-payment mock. Real payment-provider choice, callback security, and COD eligibility remain open.

## SEO and privacy invariants

- Arbitrary filter combinations are not indexable.
- Structured data must match visible, server-validated product and offer information.
- Indexing remains disabled until the production hostname, canonical policy, route taxonomy, and launch approval are confirmed.
- Collect only necessary personal data and never log credentials, tokens, cookies, payment data, addresses, personal data, raw form bodies, or full upstream payloads.
- Consent purpose, retention, analytics vendors, and marketing opt-in behavior are open.

## Explicitly unresolved policy areas

No rule is approved yet for tax, compare-at price, promotion stacking, inventory reservation, overselling, backorders, preorder, shipping fees, free-shipping thresholds, COD eligibility, payment providers, cancellation, returns, refunds, reviews, loyalty, customer deletion, data retention, staff approval thresholds, or marketplace/store inventory. These must not be inferred from common practice.
