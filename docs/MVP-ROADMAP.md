# MVP roadmap

**Status: DRAFT — recommended sequencing pending product, operations and vendor approval.**

> **Academic demo note:** an elise.vn-styled homepage/footer redesign exists as a
> non-production course exercise (see `ELISE-REDESIGN.md`). It is a visual demo only and
> does not fulfill, reprioritize, or gate any roadmap item below.

## Prioritization principles

- MVP must support a complete, supportable browse-to-order journey, not every listed feature.
- Operational capability may be supplied by approved backend/CMS/provider tools; a custom storefront admin is not automatically required.
- Do not launch a customer feature without its data ownership, exception handling, accessibility, analytics/privacy and support process.
- Gate every phase on backend contracts and legal/operational readiness, not frontend completeness alone.

## MVP — transact safely

### Customer scope

- Server-rendered category, approved collection and product pages.
- Product variants by color and size, resolved to SKU-level price and availability.
- Responsive product media, material/care/size content supplied by CMS/catalog.
- Basic search, approved facets and sorting; zero-result and service-failure recovery.
- Guest cart with simple SKU lines, quantity/update/remove and server reconciliation.
- Fixed-component bundles with size selection per component, grouped cart/order representation and no substitution.
- Guest checkout with validated contact and provider-backed Vietnamese address hierarchy.
- Eligible shipping quote/selection.
- COD and/or one approved online payment method; exact launch mix is blocking.
- Idempotent order creation, payment recovery, order confirmation and secure guest order tracking.
- Basic cancellation/return support path; self-service return workflow may wait, but policy and staff handling must exist before launch.
- Consent/privacy controls required for selected analytics and vendors.
- SEO foundations for approved category/product/collection routes, redirects, sitemap, structured data and crawl controls.

### Operational scope

- Authoritative product/SKU/publication, inventory, price and promotion management through approved systems.
- Order operations, fulfillment/tracking ingestion, payment reconciliation and customer-support lookup.
- Role-based staff access, audit logs, secret management, monitoring and incident/support runbooks.
- CMS ability for required product-support and legal content, with protected preview/publication workflow.
- Minimal consent-aware funnel analytics and operational error telemetry with redaction.

### Explicit MVP exclusions

- Customer accounts, cross-device cart, login merge and account order history.
- Wishlist and cross-device recently viewed.
- Configurable/mix-and-match bundles or component substitution.
- Automated self-service returns/refunds unless operations and integrations are ready.
- Reviews, personalized recommendations, loyalty, store locator, rich blog/lookbook and Shop the Look.
- Complex promotion stacking, marketplace/multi-store inventory, split shipment UI and advanced admin dashboards.

## Phase 2 — retention and editorial growth

- Customer account, verified contacts, saved addresses, authenticated cart and transparent login merge.
- Wishlist and consent-aware recently viewed.
- Self-service returns and refund tracking after policy/provider integration.
- Blog, Lookbook and basic Shop the Look with CMS governance.
- Rule-based recommendations and related products with deterministic fallback.
- Expanded search suggestions, synonym/typo tuning and merchandising controls.
- Promotion codes and richer campaigns after stacking/allocation rules are approved.
- Size guides, care content and evidence-backed sustainability content.
- Customer notifications and preference management.

## Phase 3 — optimization and operations

- Reviews with verified eligibility, moderation and abuse controls.
- Richer recommendations/personalization under consent and privacy rules.
- Store locator with accessible list fallback and approved map/geolocation provider.
- Advanced merchandising, scheduled collection rules, richer badges and Shop the Look conversion.
- Operational dashboards, exception queues and enhanced inventory/order/promotion tools where provider tooling is insufficient.
- Split shipments, delivery exceptions and advanced returns/refund workflows if business operations support them.
- Experimentation and attribution with privacy-safe governance.

## Future — only with demonstrated value

- Configurable mix-and-match bundles, substitutions and component-level exchange.
- Loyalty, referrals, gift cards, store credit, preorder/backorder or subscriptions.
- Omnichannel store inventory, pickup/ship-from-store and marketplace expansion.
- ML personalization, visual search, conversational shopping or dynamic pricing.
- Native applications or international currencies/locales.

## Safest bundle MVP

Use a fixed bundle definition with a fixed set and quantity of component Products. Let the customer choose one available size (and color only if the bundle explicitly allows it) for each component, resolving every choice to a SKU. The backend returns one bundle price and validates each SKU. Cart and Order retain one Bundle line/group plus component snapshots.

Exclude component swaps, optional components, quantity changes, dynamic bundle construction, automatic substitution, partial promotion manipulation and component-level return promises until their rules are approved. If return policy cannot support bundles safely, either require whole-bundle return as a clearly disclosed temporary policy or exclude bundles from MVP; this is a business/legal decision, not a frontend default.

## MVP release gates

- Approved Product/Variant/SKU, price, inventory and bundle contracts.
- Approved Vietnamese address, shipping, payment and webhook providers.
- Approved tax/invoice, COD, cancellation, return/refund, privacy/consent and retention policies.
- Demonstrated idempotency and reconciliation for checkout, payment callbacks and order creation.
- Inventory/price/promotion race tests and operational failure runbooks.
- WCAG-oriented keyboard/screen-reader/mobile checkout acceptance.
- Production SEO host/routes/canonical/structured-data approval and staging crawl protection.
- Staff RBAC, audit, monitoring, backups/recovery and customer-support readiness.

## Phase metrics to define before implementation

Do not assign numeric targets without baselines. Approve definitions and ownership for search success/zero-result rate, product-to-cart rate, cart validation adjustment rate, checkout completion, payment failure/recovery, duplicate-order prevention, fulfillment SLA, return rate/reasons, Core Web Vitals, accessibility defects and consented analytics coverage.
