# LYLE Fashion e-commerce functional scope

**Status: DRAFT — normalized scope; recommendations require approval.**

## Purpose and decision boundaries

This document defines capability boundaries and testable outcomes without selecting vendors or inventing operating policy. Confirmed rules are in `BUSINESS-RULES.md`; entity semantics are in `DOMAIN-MODEL.md`; transitions, journeys, roadmap, and unanswered decisions live in their dedicated documents.

## Capability map

### 1. Catalog and merchandising

| Domain          | Normalized scope                                                                                                         | Key dependency/open decision                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Catalog         | Customer-facing set of publishable, channel-eligible products, SKUs, prices, availability, media, taxonomy, and content. | Product information system/backend ownership and publication workflow.   |
| Category        | Durable hierarchical browse taxonomy intended for customer navigation and SEO.                                           | Approved hierarchy, category versus audience semantics, localized slugs. |
| Collection      | Curated or rule-driven merchandising grouping for campaigns, season, material, style, or editorial use.                  | Manual versus automatic membership, scheduling, SEO eligibility.         |
| Product         | Shared merchandising identity and content; never authoritative stock.                                                    | Required attributes, lifecycle, publication and localization.            |
| Product variant | Valid color/size combination offered under a product.                                                                    | Combination generation and lifecycle policy.                             |
| SKU             | Atomic purchasable and inventory-bearing identity.                                                                       | ERP/WMS code ownership, barcode, immutability.                           |
| Color           | Controlled option with localized name and accessible swatch label.                                                       | Palette governance and variant imagery.                                  |
| Size            | Controlled option with label/order and optional measurements.                                                            | Size systems, guides, fit content, product-specific variation.           |
| Material        | Controlled composition/merchandising vocabulary.                                                                         | Tencel trademark/content treatment, percentages, claims approval.        |
| Inventory       | Server-computed availability per SKU, optionally per location.                                                           | WMS/ERP, reservation and available-to-sell formula.                      |
| Pricing         | Server-resolved VND list/sale price and totals.                                                                          | Tax inclusion, validity, channel, compare-at rules, rounding.            |
| Promotion       | Backend-evaluated eligibility and benefit allocation.                                                                    | Engine/provider, stacking, codes, usage and exclusivity.                 |
| ProductImage    | Ordered product/variant media with alt text and dimensions.                                                              | DAM/CMS, transformations, rights and color accuracy.                     |
| ProductBadge    | Controlled merchandising label distinct from a discount.                                                                 | Allowed badge vocabulary, schedule and ownership.                        |

### 2. Discovery and inspiration

| Domain             | Normalized scope                                                                                                      | Key dependency/open decision                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Search             | Query products and approved content with relevance, typo handling, availability/publish filters, and safe pagination. | Search provider/index, Vietnamese analysis, freshness SLA.       |
| Search suggestions | Recent/local suggestions, approved popular terms, categories, products, and query completions.                        | Privacy, ranking, zero-result behavior and provider support.     |
| Filtering          | Facets such as category, audience, material, color, size, price, availability, or style based on approved data.       | Facet definitions, multi-select semantics, URL/canonical policy. |
| Sorting            | Explicit supported orders such as relevance or approved merchandising/price/newness orders.                           | Default ranking and price used for product-level sorting.        |
| Recommendations    | Contextual related products or outfits using approved rules/data.                                                     | Rules versus ML, consent, fallbacks, explainability.             |
| Recently viewed    | Local or account-scoped product history with removal/expiry.                                                          | Consent, retention, merge and cross-device policy.               |
| Blog               | Editorial articles with authorship, scheduling, SEO and related products.                                             | CMS model, governance and localization.                          |
| Lookbook           | Editorial visual stories with accessible media and product links.                                                     | CMS/DAM and image rights.                                        |
| Shop the Look      | Editorial composition mapping hotspots/items to purchasable products/SKUs.                                            | Availability fallback, substitutions and bundle distinction.     |
| Sustainability     | Evidence-backed material, sourcing, care and policy content.                                                          | Legal/content approval and claim substantiation.                 |

### 3. Customer intent and purchase

| Domain             | Normalized scope                                                                                                                  | Key dependency/open decision                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Wishlist           | Guest or authenticated saved-product intent; variant-aware only if approved.                                                      | Identity, merge, retention, stock/price notifications.        |
| Product bundles    | Grouped offering with fixed or configurable components and preserved identity.                                                    | Pricing, selection, promotion and return policy.              |
| Cart               | Server-owned, versioned set of simple and grouped bundle lines with validation outcomes.                                          | Cart service, expiry, quantity and inventory policy.          |
| Guest cart         | Cart addressed by secure opaque token without an account.                                                                         | Cookie/storage security, expiry, recovery and consent.        |
| Authenticated cart | Customer-owned cart available across sessions/devices.                                                                            | Identity service, merge and concurrency behavior.             |
| Checkout           | Server-authoritative collection/validation of contact, address, shipping and payment choice, ending in idempotent order creation. | Checkout/orchestration backend.                               |
| Vietnamese address | Provider-driven province/city, district, ward/commune and street data with immutable order snapshot.                              | Address dataset/API, update cadence and invalid legacy codes. |
| Shipping           | Eligible methods, fee/estimate quote, shipment creation and tracking.                                                             | Carrier/aggregator contracts, coverage and COD rules.         |
| Payment            | COD and/or online attempts, verified callbacks, retry and timeout.                                                                | Provider, capture model, reconciliation and compliance.       |

### 4. Post-purchase and customer

| Domain           | Normalized scope                                                                              | Key dependency/open decision                           |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Order            | Immutable commercial snapshot with independent lifecycle statuses and line grouping.          | OMS, order number, cancellation and audit policy.      |
| Order tracking   | Guest secure lookup and account order history/status timeline.                                | Verification method, carrier events and data exposure. |
| Customer account | Authentication, verified contacts, profile, addresses, orders, consent and account lifecycle. | Identity provider and privacy policy.                  |
| Returns          | Item/quantity request, eligibility, shipping, receipt, inspection and outcome.                | Policy, RMA/OMS/WMS and bundle behavior.               |
| Refunds          | Authorized monetary reimbursement with provider/finance status and audit trail.               | Payment/provider capability, COD method and approvals. |
| Reviews          | Verified or moderated ratings/text/media with abuse and content controls.                     | Moderation, eligibility, legal policy and vendor.      |

### 5. Content, operations, physical presence and governance

| Domain              | Normalized scope                                                                                                 | Key dependency/open decision                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| CMS                 | Localized editorial/product-support content, previews, schedules, media and references to commerce IDs.          | Vendor, preview security, webhook/revalidation and roles.                   |
| Admin               | Protected operational surfaces for catalog, inventory visibility/actions, orders, promotions, content and audit. | Backend/admin ownership; do not assume the storefront hosts all operations. |
| Analytics           | Consent-aware event taxonomy for discovery, commerce funnel, errors and operational outcomes.                    | Vendor, consent mode, identity and retention.                               |
| SEO                 | Server-rendered indexable content, metadata, canonicals, structured data, sitemaps and redirects.                | Route taxonomy, production host, content authority.                         |
| Store locator       | Search/list approved physical stores with address, hours, services and directions.                               | Store master data, geocoding/map vendor, location consent.                  |
| Consent and privacy | Purpose-specific consent, preference evidence, minimization, access/deletion workflows and retention.            | Legal basis, CMP/vendor, privacy owner and policies.                        |

## Roles and recommended responsibility boundaries

These are proposed role definitions; exact permissions require approval and least-privilege mapping.

| Role                | Recommended scope                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Guest               | Browse, search, maintain guest intent/cart, guest checkout, and securely track an eligible order.                                |
| Customer            | Guest abilities plus account profile, saved addresses, account cart, wishlist and own orders/returns.                            |
| Customer Support    | Read customer/order context with masking; create approved support actions. No direct inventory or unrestricted refund authority. |
| Order Operator      | Validate/hold/cancel/process orders within policy; no catalog publication or role management.                                    |
| Warehouse Staff     | SKU inventory operations, pick/pack/ship/receive returns within assigned location.                                               |
| Content Editor      | Draft/edit/schedule approved editorial and merchandising content; publication permissions may be separate.                       |
| Merchandiser        | Product/category/collection associations, presentation, badges and bundle definitions; no raw payment data.                      |
| Marketing           | Campaign content and promotion proposals/analytics within approval policy; no unrestricted price or customer export.             |
| E-commerce Manager  | Cross-domain operational oversight and defined approvals; no platform security administration by default.                        |
| Administrator       | Manage application configuration and staff access within an assigned scope; actions audited.                                     |
| Super Administrator | Break-glass platform/role authority, strongly authenticated, tightly limited and fully audited.                                  |

Required controls: deny by default, server-side authorization, scoped permissions rather than role-name checks, separation of duties for high-risk refunds/promotions/roles, immutable audit events, session controls, and periodic access review.

## Bundle analysis

| Concern        | Fixed bundle                                                                                         | Configurable bundle                                | Safest MVP recommendation                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Composition    | Predetermined component Products/quantities.                                                         | Customer chooses products/components from rules.   | Fixed composition only.                                                                        |
| Size selection | Resolve one valid SKU per required component.                                                        | Same, plus product-choice dependency.              | Require explicit size per component; color fixed unless expressly allowed.                     |
| Pricing        | One fixed/derived bundle price under an approved policy.                                             | May vary with selections and modifiers.            | Backend returns one authoritative bundle price; do not calculate from UI anchors.              |
| Inventory      | Available only when every required component SKU/quantity is available.                              | Must evaluate all choices and alternatives.        | Validate every selected SKU at add, cart, checkout and submit. No silent substitution.         |
| Cart           | One grouped Bundle line plus component SKU selections.                                               | Same with configuration snapshot.                  | Preserve Bundle ID, definition version and component selections.                               |
| Order          | One bundle grouping with immutable component OrderLine snapshots and allocated values when approved. | Requires full configuration snapshot.              | Preserve grouping and component identity for fulfillment/audit.                                |
| Returns        | Whole-bundle or component policy affects eligibility and refund allocation.                          | More complex due to modifiers and selection price. | Business must approve whole-versus-partial policy before launch; otherwise exclude bundles.    |
| Promotions     | Requires stacking, priority and component discount allocation.                                       | Adds selection-dependent eligibility.              | No client stacking; backend evaluates. Prefer no additional stacking until rules are approved. |

## Cart policy normalization

| Topic                 | Confirmed or recommended behavior                                                                             | Unresolved decision                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Guest cart            | **Confirmed capability:** guest purchase flow. **Recommended:** opaque token and server-owned cart.           | Token lifetime, recovery and consent.                 |
| Cart expiration       | Expired state must be explicit and recoverable where policy permits.                                          | Duration, sliding expiry and retained explanation.    |
| Authenticated cart    | Recommended for Phase 2 as customer-owned cross-session state.                                                | Identity/provider and concurrency policy.             |
| Merge after login     | Server performs deterministic merge and reports every adjustment before invalidating guest cart.              | Winner/quantity/promotion rules.                      |
| Duplicate variants    | Recommend combining simple lines with same SKU; bundles combine only if Bundle and every component SKU match. | Product approval and maximum quantities.              |
| Quantity limits       | Server-enforced; UI may display returned limit but never owns it.                                             | Per-SKU, per-order and dynamic abuse rules.           |
| Stock changes         | Mark adjusted/unavailable line, explain, and require review before checkout.                                  | Whether reduce automatically or require confirmation. |
| Price changes         | Show old/new authoritative amount and require acknowledgement at checkout.                                    | Exact messaging and tolerance, if any.                |
| Promotion changes     | Re-evaluate server-side and expose added/removed benefit with reason code.                                    | Stacking, persistence and coupon retention.           |
| Removed products      | Keep a non-purchasable explanatory line long enough for recovery; never silently remove.                      | Retention duration and alternatives.                  |
| Discontinued variants | Block purchase and distinguish permanent discontinuation from temporary stockout.                             | Substitute/redirect policy.                           |
| Bundle lines          | Stay grouped with immutable selection snapshot for each component SKU.                                        | Editing/reconfiguration and return policy.            |
| Server validation     | Required on read/mutation, checkout start and final submission with cart version/idempotency controls.        | API concurrency/error contract.                       |

## Checkout policy normalization

| Topic                  | Confirmed or recommended behavior                                                                  | Unresolved decision                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Guest checkout         | **Confirmed capability.** No account creation required.                                            | Contact verification and post-order account offer.          |
| Contact                | Visible recipient/contact fields, purpose disclosure and server validation.                        | Required email/phone and verification.                      |
| Province/district/ward | Provider-backed codes and labels stored as an Order snapshot.                                      | Provider, boundary updates and fallback.                    |
| Street address/note    | Free text with length/content validation; note optional.                                           | Exact limits and carrier constraints.                       |
| Shipping               | Backend returns serviceable methods, fee and estimate for current cart/address.                    | Carriers, coverage, quote expiry and fee policy.            |
| COD                    | Treat as a payment method only when backend says eligible.                                         | Limits, confirmation, collection status and failure policy. |
| Online payment         | Create a PaymentAttempt tied to one Order; verify outcome server-to-server.                        | Provider, methods, authorization/capture and fees.          |
| Retry                  | Reuse Order and create/reuse attempts according to idempotent backend rules.                       | Retry limit, alternative method and late success.           |
| Timeout                | Display `PENDING`/`EXPIRED` only from server/provider state; preserve recovery.                    | Timeout duration and reconciliation SLA.                    |
| Idempotency            | Required for checkout submission, order creation, payment initiation and callback processing.      | Key scope and retention.                                    |
| Duplicate prevention   | Disable pending UI action plus enforce server uniqueness/idempotency; UI alone is insufficient.    | Business duplicate-detection review.                        |
| Confirmation           | Show durable Order reference and independent statuses after backend creation.                      | Notification channels/templates.                            |
| Failure recovery       | Preserve cart/order context, identify recoverable field/state and avoid claiming unknown outcomes. | Cancellation/expiry and support escalation.                 |

## Major-module acceptance criteria

### Catalog, category, collection and product

- **Success:** published eligible items show consistent content, valid option combinations, server price and availability.
- **Loading:** reserve media/content geometry and expose meaningful progress without replacing the whole route unnecessarily.
- **Empty:** distinguish an intentionally empty collection from unavailable/unpublished content and offer approved navigation.
- **Error:** retain navigable context, safe retry and correlation/support path; never fabricate price or stock.
- **Validation:** reject invalid slugs, unpublished entities, invalid option combinations and stale SKU references server-side.
- **Mobile:** option controls and media work without horizontal overflow; primary information precedes secondary editorial content.
- **Accessibility:** semantic headings/lists, descriptive alt text, text labels for color, operable galleries, 44px targets, announced selection/stock errors.
- **Analytics:** view/list/select events use stable commerce IDs, positions and safe context; no personal data.
- **SEO:** server-render canonical product/category content; valid metadata/structured data; redirect changed slugs; exclude unpublished content.

### Search, suggestions, filtering and sorting

- **Success:** query/facets/order produce deterministic, relevant, publish-eligible results and preserve navigable URL state.
- **Loading:** keep query and selected facets visible; announce result refresh; prevent layout jumps.
- **Empty:** show query/facet context, safe recovery and approved alternatives without claiming nonexistent products.
- **Error:** preserve controls, distinguish service failure from zero results, and allow retry.
- **Validation:** normalize query length/characters, allowlist facets/sorts, cap pagination and protect backend resources.
- **Mobile:** filters use an accessible dismissible surface, show applied count, preserve scroll and avoid hover-only controls.
- **Accessibility:** labeled search, keyboard suggestions, correct combobox/listbox semantics, result count announcements and removable facet names.
- **Analytics:** query and interaction events follow privacy/search-term policy; avoid raw sensitive queries.
- **SEO:** internal search and arbitrary facet combinations default non-indexable; approved category landing routes own indexability.

### Wishlist and recently viewed

- **Success:** state persists according to identity/consent rules and clearly reflects availability changes.
- **Loading:** avoid false unsaved state and duplicate actions during synchronization.
- **Empty:** explain the feature and provide a non-coercive path to browsing.
- **Error:** preserve local intent where safe and explain retry/sign-in requirements.
- **Validation:** validate product/variant existence, ownership, limits and merge requests server-side.
- **Mobile:** reachable controls, immediate feedback and no gesture-only deletion.
- **Accessibility:** accessible toggle names/states, focus retention and non-color feedback.
- **Analytics:** consent-aware add/remove/view events; no silent cross-device tracking.
- **SEO:** personal lists are non-indexable and never exposed in public caches.

### Bundles and recommendations

- **Success:** every required component selection resolves to a valid SKU; grouped price and availability are server-confirmed.
- **Loading:** keep component context visible and identify which selection is resolving.
- **Empty:** explain unavailable components and approved alternatives; never silently substitute.
- **Error:** identify failing component/price validation and preserve recoverable selections.
- **Validation:** enforce required components, allowed SKUs, quantities, price policy, promotion interaction and stock server-side.
- **Mobile:** one component decision at a time, visible bundle summary and no hidden selected size.
- **Accessibility:** component groups use fieldset/legend semantics; errors link to the affected selection.
- **Analytics:** bundle ID, component product/SKU IDs and selection outcomes; avoid duplicated product revenue events.
- **SEO:** only approved stable bundle/look routes index; visible bundle offers match structured data.

### Cart, guest cart and authenticated cart

- **Success:** server returns current lines, grouped bundles, validated totals and explicit adjustments.
- **Loading:** existing cart remains readable while mutations are pending; affected controls expose pending state.
- **Empty:** provide clear continuation without manufacturing recommendations.
- **Error:** retain last confirmed server state, allow safe retry and avoid optimistic claims after failure.
- **Validation:** ownership/token, SKU, quantity, stock, price, promotion, bundle composition and cart version are server-checked.
- **Mobile:** totals/actions remain reachable without obscuring lines; quantity controls meet touch requirements.
- **Accessibility:** line names/options, quantity controls, removal confirmations and price changes are announced clearly.
- **Analytics:** item-level add/remove/quantity/view-cart events with authoritative currency/value after response.
- **SEO:** cart is private, non-indexable and must not leak through shared caching.

### Checkout, Vietnamese address and shipping

- **Success:** validated contact/address/methods produce a reviewable server total and one durable order.
- **Loading:** step/progress and entered data persist; quote/address requests identify pending fields.
- **Empty:** unavailable shipping/payment methods explain why and provide a recovery route.
- **Error:** field and summary errors identify causes; upstream timeout preserves safe retry and cart.
- **Validation:** visible labels, contact format, provider-backed address codes, serviceability, quote freshness, delivery note limits, consent and full cart revalidation.
- **Mobile:** correct input modes/autocomplete, at least 44px controls, progressive disclosure, sticky actions that do not cover errors/content.
- **Accessibility:** fieldset/legend grouping, error summary with focus, inline associations, live status and keyboard-complete flow.
- **Analytics:** step/view/error/selection/submit outcomes use allowlisted codes; never emit address/contact/note/payment data.
- **SEO:** checkout routes are private/non-indexable and excluded from caches/sitemaps.

### Payment and order confirmation

- **Success:** verified backend/provider outcome maps to independent payment/order state and a durable reference.
- **Loading:** communicate external processing and prohibit duplicate submission without preventing safe recovery.
- **Empty:** no payment method is an actionable eligibility/configuration state, not a blank control.
- **Error:** distinguish failed, cancelled, expired and unknown/pending; provide status refresh or approved retry.
- **Validation:** amount/order identity/idempotency/provider callback authenticity and state transition are server-controlled.
- **Mobile:** preserve return path from provider/app switch and avoid session loss.
- **Accessibility:** processing and result changes announced; focus moves to meaningful result heading.
- **Analytics:** safe method category and outcome codes only; no credentials or provider payload.
- **SEO:** confirmation and payment routes are non-indexable, token-protected and private-cache only.

### Order tracking, account, returns and refunds

- **Success:** authorized customer/guest sees current status, item quantities and policy-permitted actions.
- **Loading:** show last known safe state and announce refresh.
- **Empty:** distinguish no orders/returns/refunds from unauthorized lookup.
- **Error:** do not reveal whether an order exists before verification; offer safe support/retry.
- **Validation:** ownership/lookup proof, eligible lines/quantities/window/reasons, transition and refund amount are server-checked.
- **Mobile:** vertical timeline, readable line detail and progressive return steps.
- **Accessibility:** statuses are text-first, timelines semantic, errors focused, evidence uploads labeled if approved.
- **Analytics:** lifecycle views/actions use opaque IDs and reason codes; exclude personal/evidence content.
- **SEO:** all personal/order lifecycle routes are non-indexable and protected from shared caches.

### Reviews and recommendations

- **Success:** approved content is attributable according to policy and recommendations have safe fallback.
- **Loading/empty/error:** distinguish no content from service failure; core product content remains usable.
- **Validation:** eligibility, moderation, content limits, abuse/rate controls and consent are server-enforced.
- **Mobile/accessibility:** readable controls, labeled rating inputs, keyboard support and non-color score meaning.
- **Analytics:** impression/interaction events use safe IDs and consent; moderation data stays operational.
- **SEO:** only approved review content is rendered/structured; do not expose unmoderated content or misleading aggregate ratings.

### CMS, blog, lookbook, Shop the Look and sustainability

- **Success:** scheduled approved localized content resolves valid commerce references and media.
- **Loading/empty/error:** editorial absence does not break commerce; previews identify draft/error safely.
- **Validation:** role, publication state, schedule, slug, media rights/alt text, links and claims are validated.
- **Mobile/accessibility:** responsive editorial media, readable measure, correct headings, captions and hotspot alternatives.
- **Analytics:** content IDs, impressions and commerce transitions with consent.
- **SEO:** canonical server-rendered content, author/date/schema where approved, redirect and sitemap policy.

### Admin and operations

- **Success:** authorized staff complete scoped actions with audit evidence and current data.
- **Loading/empty/error:** preserve filters/forms safely, distinguish no data from denied access, and provide non-destructive retry.
- **Validation:** server authorization, optimistic versioning, reason/approval rules, input schemas and idempotency.
- **Mobile:** critical emergency/read tasks may work responsively; dense workflows may define an approved desktop minimum rather than unsafe compression.
- **Accessibility:** keyboard-complete tables/forms, focus/error management, labeled status and no color-only operations.
- **Analytics:** immutable audit events separate from product analytics; sensitive fields redacted.
- **SEO:** all admin surfaces authenticated, non-indexable and excluded from public caching.

### Store locator, analytics, consent and privacy

- **Success:** accurate store data and consent-respecting measurement/preferences.
- **Loading/empty/error:** list fallback without map/geolocation; consent controls remain available if vendors fail.
- **Validation:** store publication/hours, location input, consent purpose/version and preference ownership.
- **Mobile:** list-first locator, optional geolocation, no blocked core journey; preferences operable on small screens.
- **Accessibility:** map has equivalent list, directions are labeled, consent is granular and not manipulative.
- **Analytics:** no non-essential tracking before required consent; consent changes are auditable.
- **SEO:** approved store pages may index with LocalBusiness data; preference/privacy operational routes do not.

## Cross-domain dependencies

- **Backend:** catalog/PIM, inventory/WMS, pricing/promotions, cart, checkout orchestration, OMS, returns/refunds, identity/RBAC, search indexing, audit logs.
- **CMS/DAM:** localized product/editorial content, media, previews, redirects, blog/lookbook/sustainability/store content.
- **Payment:** COD policy, online provider, webhook verification, idempotency, retry/timeout, capture/refund/reconciliation.
- **Shipping:** Vietnamese administrative data, serviceability, quote/ETA, label/tracking, COD handoff and returns.
- **Platform:** deployment/cache boundaries, observability with redaction, secret management, queues/webhooks and incident response.

## Risks and edge cases

### Risk register

| Area               | Principal risks                                                                                                                                                                                          | Required mitigation/dependency                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security           | Guest cart/token theft, cart fixation, IDOR in order tracking/returns, duplicate orders/payments, forged callbacks, staff privilege escalation, promotion/refund abuse, sensitive logs/exports/previews. | Opaque rotating tokens, server authorization, idempotency, signed webhook verification, rate/abuse controls, least privilege/MFA/audit, redaction and threat models.  |
| SEO                | Client-only product content, stale offer/availability schema, duplicate slugs/canonicals, filter crawl traps, internal-search indexing, unpublished preview leakage and redirect loss.                   | Server rendering, approved route/canonical/facet rules, synchronized system-of-record data, protected previews, redirect ownership and automated crawl/schema checks. |
| Accessibility      | Color-only swatches/statuses, inaccessible galleries/comboboxes/filter drawers, missing form labels/errors/focus, unannounced cart changes, map-only locator and motion dependence.                      | Semantic patterns, text alternatives, keyboard/screen-reader acceptance, error summary/focus, live regions, reduced motion, contrast and equivalent list content.     |
| Mobile UX          | Hidden checkout errors behind keyboard/sticky bars, cramped variant/bundle selection, lost state on browser/provider return, horizontal filters/tables, small targets and unstable media layout.         | 375px-first acceptance, 44px targets, progressive forms, safe sticky offsets, state recovery, vertical summaries/timelines and reserved media geometry.               |
| Commerce integrity | Stale stock/price/promotion, bundle component failure, cart merge races, partial fulfillment/return ambiguity and inconsistent historical snapshots.                                                     | SKU authority, revalidation, versioning, grouped snapshots, independent statuses and explicit compensation policies.                                                  |
| Privacy            | Tracking before consent, raw search/contact/address analytics, indefinite guest/recent history, unauthorized support access and unsubstantiated data reuse.                                              | Purpose limitation, consent gating, minimization, retention/deletion policy, masking/RBAC and processor governance.                                                   |

### Edge cases

- SKU sells out or is discontinued between selection, cart, checkout, payment and fulfillment.
- Price/promotion changes during a session; stale client total or duplicated promotion application.
- One bundle component becomes unavailable; partial return/refund or component substitution ambiguity.
- Guest token theft, cart fixation, merge race, multi-tab mutation or cross-device conflict.
- Payment callback arrives late, duplicated, out of order, or after customer abandons return URL.
- Order is created but confirmation response is lost; repeated submit must recover the same result.
- Address division codes change or carrier coverage differs from address provider.
- Carrier event is stale, contradictory, missing, or exposes sensitive tracking data.
- Product slug/title/content changes after order; historical line must remain unchanged.
- Search indexes unpublished/stale price/stock content; filter URLs create crawl traps.
- Consent is withdrawn after analytics identifiers or recently viewed data were created.
- Admin exports, logs, previews, media URLs or caches expose customer/draft data.
- Mobile keyboard/sticky controls hide checkout errors; browser back loses selections; provider return loses session.

## Missing functions identified

Required for a production-capable system but absent from prior scope decisions: authentication recovery, account/contact verification, cancellation, fraud/abuse controls, tax/invoicing, notifications, customer support tooling, audit history, data export/deletion, consent preference center, product import/publication workflow, image governance, size guide, care instructions, order reconciliation, inventory adjustment reasons, shipment/return labels, exception handling, redirects, preview, feature flags, monitoring and incident operations.

## Duplicate and conflicting requirements

- **Duplicate:** Lyocell and Tencel may represent the same underlying fiber with trademark implications; taxonomy must avoid accidental duplication.
- **Duplicate boundary:** Lookbook, Shop the Look, recommendations and bundles can all group products, but their intent differs: editorial composition, purchasable mapping, algorithmic suggestion, and commercial grouped offer.
- **Duplicate boundary:** Category and Collection both group products; category is durable navigation taxonomy, collection is curated/campaign grouping.
- **Potential conflict:** “Premium minimalist” is brand direction, while Casual/Office/Everyday/Premium may be merchandising attributes; none should silently become a URL hierarchy.
- **Potential conflict:** guest checkout does not imply guest order lookup without verification or unlimited guest data retention.
- **Potential conflict:** approximate price anchors cannot become fixed frontend values or guaranteed bundle discounts.

No existing confirmed repository requirement directly conflicts with this normalized scope.
