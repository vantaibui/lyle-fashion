# User journeys

**Status: DRAFT — journeys describe intended capability; unresolved policy is linked to `OPEN-QUESTIONS.md`.**

All customer journeys are mobile-first, keyboard-complete, server-authoritative at commerce transitions, and instrumented only with consent-appropriate allowlisted analytics. Loading, empty, error, validation, accessibility, analytics, and SEO criteria are defined per major module in `ECOMMERCE-FUNCTIONAL-SCOPE.md`.

## Storefront journeys

### Browse category

1. Guest or Customer opens an indexable category URL.
2. Server renders approved category content and initial publish-eligible products.
3. User browses, paginates/loads more according to approved pattern, or opens a product.
4. Returning from product preserves category context and scroll where feasible.

Exceptions: empty category, invalid/renamed slug, stale search index, product removed during browsing. Arbitrary filter URLs do not inherit category indexability.

### Browse collection

1. User opens an active collection from navigation/editorial link.
2. Server renders collection content, schedule-valid membership and product availability summaries.
3. User opens a product or another curated destination.

Exceptions: scheduled/unpublished collection, empty membership, expired campaign, renamed slug. Redirect/archive behavior is open.

### Search

1. User focuses the labeled search control and enters a query.
2. Accessible suggestions may show approved query/category/product options.
3. User submits or selects a suggestion.
4. Results show normalized query, count, supported filters/sort and recovery for zero results.
5. User opens a result and can return without losing context.

Exceptions: short/unsafe query, no results, service timeout, stale index, unavailable suggested product. Raw sensitive queries must not be sent to analytics.

### Filter

1. User opens filter controls and reviews available facets/counts.
2. User selects/removes facets; selected state is visible in control and result context.
3. Results update with a shareable URL state where approved.
4. User clears one or all facets.

Exceptions: combination yields zero products, facet disappears after selection, invalid URL facet, backend timeout. On mobile, applied changes and dismissal behavior must be explicit.

### Open product

1. User opens the canonical product route.
2. Server renders title, media, material/content, server price/availability summary and valid options.
3. User explores media, care/size information and approved related content.
4. User selects a valid color and size before purchase action.

Exceptions: unpublished product, changed slug, all SKUs unavailable, incomplete content, media failure. Product page must not claim product-level stock when only SKU stock is authoritative.

### Select color

1. User encounters labeled color options with text names.
2. Selecting a color updates available size combinations and approved variant media.
3. Current selection is visibly and programmatically announced.

Exceptions: unavailable color, stale selection URL, image failure. Never identify color by swatch alone.

### Select size

1. User reviews size labels and optional approved size guide.
2. User selects a size valid for the chosen color.
3. Server-backed SKU/availability is resolved before purchase confirmation.

Exceptions: size sells out, invalid color/size pair, unknown fit/guide. Do not auto-substitute another size.

### Add simple product

1. User selects valid color and size, then activates Add to Cart.
2. UI marks the action pending and sends SKU, quantity, cart version/context—not trusted price.
3. Server validates SKU, quantity, availability, price and promotion context.
4. UI confirms the authoritative line or displays a recoverable line-specific error.

Exceptions: stale cart version, quantity cap, price/stock change, discontinued SKU, network timeout. Retrying must not create unintended duplicates.

### Add bundle

1. User opens an active Bundle offer.
2. UI presents every required fixed component and available size selection.
3. User completes all selections and reviews server-priced grouped summary.
4. Server validates Bundle, selected component SKUs, quantities, stock, price and promotions.
5. Cart shows one grouped Bundle line with component details.

Exceptions: incomplete selection, unavailable component, price/promotion change, identical versus different component selections. No silent substitution or flattening into unrelated simple lines.

### Wishlist

1. User toggles an accessible Save action from an eligible product context.
2. Guest/account behavior follows approved identity and consent rules.
3. Saved list displays current product status and allows removal/opening.

Exceptions: sign-in required by chosen policy, merge conflict, product removed, storage/service failure. Wishlist identity and variant granularity are open.

## Checkout and post-purchase journeys

### Guest checkout

1. Guest starts checkout from a server-validated cart.
2. System collects contact/recipient data with visible labels and privacy context.
3. User selects provider-backed province/city, district and ward/commune, then enters street address and optional note.
4. Backend returns eligible shipping methods/quotes; user selects one.
5. Backend returns eligible payment methods; user selects COD or online payment if approved/available.
6. User reviews grouped lines, address, shipping and authoritative totals.
7. One idempotent submit creates/reuses a durable Order and initiates required payment.
8. User receives confirmation or an explicit pending/failure recovery state.

Exceptions: invalid contact/address, quote expiry, inventory/price/promotion change, no shipping/payment method, timeout, lost response, duplicate tap, provider redirect loss. Entered non-sensitive data should survive recoverable failures according to privacy policy.

### Payment success

1. Provider/backend completes an approved payment state.
2. Backend verifies callback/status independently of browser return parameters.
3. Customer return resolves the durable Order by safe session/reference.
4. Confirmation shows order reference, independent statuses and next step.

Exceptions: callback precedes/lingers behind redirect, duplicate callback, page refresh, already-confirmed order. The browser never marks payment successful by itself.

### Payment failure

1. Backend/provider classifies failed, cancelled, expired or still-pending outcome.
2. UI shows the exact recoverable state and retains Order/cart context.
3. User retries through a new PaymentAttempt or selects another approved method without duplicating the Order.
4. Final failure/cancellation follows approved expiry policy.

Exceptions: unknown provider state, late success after shown failure, multiple tabs, retry amount changed. Status refresh and reconciliation must be idempotent.

### Track order

1. Customer opens own authenticated order, or Guest supplies approved lookup proof.
2. Backend authorizes access without revealing order existence prematurely.
3. UI shows line snapshots, grouped bundles and independent status timeline.
4. User takes only policy-eligible actions or follows support guidance.

Exceptions: invalid proof, expired lookup token, carrier delay/conflict, split shipment, no tracking record. Personal data is masked appropriately.

### Return product

1. Authorized customer/guest opens a delivered eligible Order.
2. User selects eligible OrderLine quantities and approved reason/evidence.
3. Backend validates window, item, quantity, prior returns and bundle policy.
4. User reviews instructions/cost and submits one return request.
5. Timeline tracks review, transit, receipt, inspection and completion.

Exceptions: ineligible/final-sale item, partial bundle request, duplicate quantity, missing evidence, window expiry, carrier failure. Return and refund are distinct lifecycles.

### Login and merge cart

1. Guest with a cart authenticates successfully.
2. Server loads guest and Customer carts and applies approved deterministic merge rules.
3. Every resulting line is revalidated for SKU, bundle, quantity, stock, price and promotion.
4. Customer receives a clear summary of combined, adjusted, unavailable or removed lines.
5. Guest token is rotated/invalidated according to security policy.

Exceptions: same SKU on both carts, same Bundle with different selections, quantity cap, stale lines, concurrent account-cart update, login failure. Never silently discard either cart before durable merge success.

## Administrative journeys

### Admin creates product

1. Authorized Merchandiser opens a new product draft.
2. Enters validated shared content, taxonomy, materials, media/alt text and SEO draft fields.
3. Defines only valid color/size variants and maps each to a unique SKU supplied/approved by its system of record.
4. Completes required review/publication workflow.
5. Publish action is authorized, audited and synchronized to storefront/search/cache systems.

Exceptions: duplicate SKU/slug, missing required content, invalid material claim, media/alt issue, concurrent edit, downstream sync failure. Draft must not become public because a partial sync succeeded.

### Admin updates inventory

1. Authorized Warehouse Staff finds a SKU, not merely Product.
2. Reviews current location/aggregate inventory and version.
3. Submits an adjustment/reservation operation with approved reason and quantity.
4. Backend validates authorization, version, bounds and inventory policy.
5. Result and audit record are shown; storefront availability updates within an approved SLA.

Exceptions: stale version, negative result, reserved stock conflict, wrong location, duplicate submit, downstream outage. Whether manual adjustment is permitted versus ERP-only is open.

### Admin creates promotion

1. Authorized Marketing/Merchandising role creates a draft with scope, schedule, eligibility, benefit, limits and priority/exclusivity.
2. System previews examples and detects obvious conflicts according to approved engine rules.
3. Required approver reviews high-risk price impact.
4. Publish is authorized, audited and scheduled.
5. Storefront/cart/checkout show only server-evaluated eligible results.

Exceptions: overlapping promotion, invalid dates/scope, excessive benefit, stale approval, usage race, rollback need. Frontend preview is never the final evaluator.

## Journey-wide acceptance

- Browser back/forward and refresh preserve safe, URL-appropriate context.
- Every mutation has pending, success, recoverable error and non-recoverable outcome behavior.
- No flow relies only on color, hover, swipe or animation.
- Checkout and admin forms provide visible labels, inline errors, an error summary and focus management.
- Commerce analytics occur after authoritative responses and distinguish impressions from confirmed outcomes.
- Private journeys are non-indexable and protected from shared caching.
