# E-commerce domain model

**Status: DRAFT — structural recommendations pending backend and product approval.**

## Core ownership chain

```text
Product
  └─ ProductVariant (one valid color + size combination)
       └─ SKU (purchasable identity)
            ├─ Inventory (per location or aggregate policy)
            └─ Price (currency, amount, validity and channel scope)
```

- **Product** owns merchandising identity and shared content.
- **ProductVariant** expresses a valid customer-selectable option combination.
- **SKU** is the atomic purchasable, stock-tracked identifier. One variant normally resolves to one active SKU for a sales channel; exceptions require an explicit contract.
- **Inventory** is managed per SKU, never inferred at Product or Color/Size level.
- **Price** is server-authoritative and must resolve for the SKU, channel, currency, customer context, time, and applicable promotion policy.

## Entity definitions

### Product

Merchandising aggregate for a sellable garment or set concept. Recommended fields: stable ID, localized title/slug/description, gender/audience, status, category and collection relationships, materials, badges, media, SEO fields, care/content references, and timestamps. It must not carry authoritative stock.

### ProductVariant

A valid purchasable selection under a Product, defined for LYLE by Color and Size. Recommended fields: ID, product ID, color ID, size ID, display ordering, status, media overrides, and SKU relationship. Invalid combinations do not get placeholder variants.

### SKU

Atomic commerce identity used by cart, inventory, warehouse, order, return, and reporting systems. Recommended fields: immutable internal ID, human/business SKU code, variant ID, barcode if applicable, status, weight/dimensions where needed, and fulfillment attributes. Changing a product title or slug must not change historical SKU identity.

### Category

Durable browse taxonomy node, potentially hierarchical, such as audience or garment type. Recommended fields: ID, parent ID, localized name/slug/content, ordering, status, SEO fields. Category versus collection semantics must be approved.

### Collection

Curated or rule-driven merchandising grouping that may be seasonal, campaign-based, material-based, or editorial. Recommended fields: ID, localized content, membership mode, schedule, ordering, status, SEO fields. Rule-driven membership syntax is open.

### Material

Controlled vocabulary entry for composition or merchandising claims. Recommended fields: ID, canonical name, localized label, description, care/sustainability references, and optional percentage at product/component level. Legal substantiation is required for sustainability claims.

### Color

Controlled option value with ID, localized name, optional swatch representation, sort order, and accessibility-friendly text. A swatch is not sufficient identification by itself.

### Size

Controlled option value with ID, localized label, sort order, and optional size-system/measurement reference. Size guides and product-specific fit notes are separate content.

### Inventory

Availability record scoped to SKU and, if required, location. Candidate quantities include on-hand, reserved, safety stock, and available-to-sell, but their formula is open. The storefront consumes server-computed availability rather than calculating it.

### Price

Server-owned monetary record for a SKU or explicitly priced Bundle. Recommended fields: currency (`VND` for this storefront), integer amount representation, price type, validity interval, channel, tax treatment, and optional compare-at reference. Promotion-adjusted totals remain separate calculations.

### Promotion

Eligibility and benefit policy evaluated by the backend. Candidate fields: ID/code, status, schedule, audience/channel, qualifying scope, benefit, usage limits, priority, exclusivity, and audit data. Stacking and allocation rules are open.

### ProductImage

Media asset relationship with product or optional variant scope. Recommended fields: asset ID, alt text, role, sort order, dimensions/aspect ratio, focal data, and locale. Color accuracy and asset governance are operational dependencies.

### ProductBadge

Controlled merchandising label such as editorial or availability messaging. It is not a promotion engine. Recommended fields: ID, localized label, semantic type, schedule, priority, and product association.

### Bundle

Sellable grouped offering with its own ID, localized merchandising content, status, component definitions, price policy, and eligibility dates. Bundle identity persists in cart/order even though stock is evaluated on component SKUs.

### BundleComponent

Required position within a Bundle. Recommended fields: ID, bundle ID, product/allowed-SKU scope, required quantity, selection rules, sort order, and substitution policy. MVP recommendation: fixed product/component list with customer size selection among valid SKUs.

### Cart

Mutable server-owned purchase intent for a guest token or authenticated Customer. Recommended fields: ID, owner type/reference, currency, lines, version, expiry, applied promotion references, totals snapshot, validation status, and timestamps. Totals are snapshots, not authority for order placement.

### CartLine

Either a simple SKU line or grouped Bundle line. Recommended fields: ID, line type, SKU and quantity for simple lines, or bundle ID plus component SKU selections for bundle lines; server price snapshot, promotion allocation, validation messages, and version. A line must never ambiguously represent both types.

### Order

Immutable commercial record created from a server-validated checkout. Recommended fields: ID/reference, customer or guest contact snapshot, address snapshot, currency, monetary totals, lines, independent statuses, payment/shipping references, consent evidence where applicable, and audit timestamps.

### OrderLine

Historical purchase snapshot. Preserve product/SKU/bundle identity, customer-facing names/options, quantity, unit/list/net amounts, tax and promotion allocation when defined, fulfillment/return quantities, and bundle grouping. Later catalog edits must not rewrite history.

### Customer

Account identity separate from guest Order contact. Recommended fields: ID, verified contact methods, profile data, consent records, account status, addresses, and timestamps. Authentication implementation and deletion/retention rules are open.

### Address

Structured Vietnamese delivery/billing address with recipient, phone, province/city code and label, district code and label, ward/commune code and label, street line, optional note, and country. Orders store an immutable snapshot even if the saved Customer address later changes.

## Supporting concepts required but not requested as core entities

- SearchDocument/SearchSuggestion, Wishlist/WishlistItem, RecentlyViewedEvent.
- Shipment/Fulfillment, Payment/PaymentAttempt, Return/ReturnLine, Refund.
- Review, Recommendation, ContentEntry, StoreLocation, ConsentRecord, AnalyticsEvent.
- AdminUser, Role, Permission, AuditLog.

These may live in separate bounded contexts and must not be forced into the catalog aggregate.

## Key constraints

- IDs are stable and opaque; URLs use changeable slugs with redirect policy.
- Historical Order data is snapshotted; catalog objects remain references for navigation only.
- Monetary values never use floating-point arithmetic across trust boundaries.
- Statuses are explicit enums with guarded transitions, not free text.
- Every mutation requiring retry supports optimistic versioning and/or idempotency as appropriate.
- Domain timestamps use an unambiguous server format; presentation uses `vi-VN` and the approved Vietnam timezone policy.

## Backend contract dependencies

Entity ownership, IDs, pagination, search indexing, availability calculation, inventory reservation, price/tax representation, promotion evaluation, cart versioning, checkout idempotency, status events, and audit retention require backend contracts before frontend implementation.
