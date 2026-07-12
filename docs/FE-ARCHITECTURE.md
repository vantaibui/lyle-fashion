# Frontend architecture

**Status:** APPROVED FOUNDATION; domain integrations remain DRAFT.

## Runtime model

LYLE Fashion uses Next.js App Router, React and strict TypeScript on the default Node.js runtime. Routes are React Server Components unless browser state, effects or event handlers require a narrow client boundary. Route groups `(storefront)` and `(account)` organize URL ownership without changing public paths.

```text
Browser interaction
  -> narrow Client Component
  -> same-origin authenticated endpoint or Server Action (when approved)
  -> server-side module/service
  -> normalized API client
  -> commerce, CMS, identity, search or analytics provider

Server-rendered route
  -> module/service
  -> server-only API client
  -> validated response
  -> minimal serialized view data
```

## Ownership

- `src/app`: routing, metadata and route-level boundaries; no business rules.
- `src/modules`: domain capabilities and private UI/data code.
- `src/components`: demonstrated shared UI; commerce components remain presentation-only.
- `src/design-system`: CSS token source of truth and foundations.
- `src/lib/api`: provider-neutral transport, error and pagination foundations.
- `src/lib/validation`: cross-route trust-boundary schemas and typed URL state.
- `src/lib/seo`: canonical, metadata and structured-data foundations.
- `src/lib/cache`: cache tag vocabulary and server-only revalidation adapter.
- `src/config`: typed public/server environment schemas.

Modules may depend on shared foundations but must not reach into another module's internals. Prefer direct file imports and avoid barrels. Business-specific response schemas, mappers and services remain inside their owner module when provider contracts are approved.

## Server and client boundaries

- Fetch public catalog/editorial data in Server Components or server-only services. Start independent requests together and use Suspense boundaries where streaming improves the route.
- Use Client Components only for controls such as filters, variant selection, forms and optimistic interactions. Pass only the fields the interaction uses.
- URL state owns shareable filter, sort, pagination, query and variant selections. Do not mirror it in broad Context or a client store.
- Cart, checkout, customer and order data are private, dynamic and excluded from shared caches.
- Server Actions and route handlers require the same authentication, authorization, input validation and idempotency as public APIs. They are not trusted merely because they are server files.

## Image and font architecture

- Product images reserve a 4:5 aspect ratio; collection/editorial crops require CMS-provided dimensions and focal data. Hero art direction may use `<picture>` only for meaningfully different approved crops; otherwise use `next/image` with accurate `sizes`.
- Configure exact HTTPS CDN `remotePatterns` only after the DAM/CDN hostname and path are approved. Never permit arbitrary remote hosts.
- Above-the-fold LCP may mark one relevant image for preload. Other media lazy-loads. Width/height or a reserved aspect-ratio box is mandatory to prevent CLS; placeholders must be supplied by the image service or a neutral token surface.
- Product-grid baseline `sizes`: `(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw`; tune against the actual container. Collection and hero values must match their layout.
- The existing system stacks preserve deterministic builds and Vietnamese support. Approved WOFF2 assets should use one root-level `next/font/local` integration with `display: swap` or `optional`, variable fonts where licensed, and only used weights. Validate Vietnamese glyph coverage and fallback metrics before release.

## Decisions deferred

Commerce backend, CMS, authentication, search, analytics, image CDN, cache webhook authentication, deployment adapter, observability and state management are unselected. Do not add provider adapters or enable indexing until their contracts and owners are approved.

## Product listing architecture

`/shop`, `/men`, `/women` and `/collections/[slug]` render through one `CatalogPage` Server Component. Route files validate route/search parameters and own metadata; `catalog-page` composes landing content, result state and shared shells. `getCatalogPageData` starts landing and catalog reads together and uses React request memoization so metadata/page composition can share equivalent reads.

The catalog module owns provider contracts, Zod response schemas, the production HTTP adapter, temporary mock adapter, URL transformations, metadata decisions and PLP-specific components. Routes do not know provider response formats. `catalogConfig` is the single temporary adapter-selection point.

```text
route params + searchParams
  -> runtime parsing / fixed route context
  -> CatalogQuery
  -> server CatalogResultProvider
  -> validated CatalogResult
  -> Server Component page/grid
       -> narrow CatalogControls client boundary
       -> independent ProductCard client boundaries
```

Product summaries are display snapshots, never cart authority. Wishlist and Quick Add call typed same-origin boundaries; the backend must revalidate SKU, inventory, price and eligibility. Recently viewed remains deferred because consent, retention and identity ownership are unresolved.

## Product detail architecture

`/product/[slug]` now follows the same server-first contract as listing routes:

```text
route params + searchParams
  -> runtime slug/query parsing
  -> cached product page service
  -> server-rendered metadata + JSON-LD
  -> Server Component route shell
       -> narrow PDP client boundary
            -> gallery interaction
            -> color / size selection
            -> bundle component size selection
            -> add-to-cart / buy-now intent
```

- Metadata and page content share one cached product read so the route does not duplicate product fetches for the same slug/query combination.
- Canonical product content is rendered on the server. Variant query state is shareable URL state, but it does not change the canonical route identity.
- The PDP client boundary owns only local interaction state. Product copy, price snapshots, stock labels, gallery media, badges, bundle definitions and recommendations are serialized from the server.
- Bundle PDP behavior is limited to the approved safest MVP shape: fixed components, fixed color per component unless explicitly allowed, explicit size selection per component and one grouped bundle intent payload.

## Cart and checkout foundation

- `/cart`, `/checkout`, and `/order-success` are dynamic private routes backed by server-owned cart/order snapshots.
- The current foundation uses an opaque httpOnly guest-cart cookie plus an in-process server store. This is intentionally local-only and must be replaced with durable backend storage before launch.
- Header cart UI is a narrow client boundary that re-reads the authoritative same-origin cart endpoint after product-card or PDP mutations. Client-side totals are display-only.
- Checkout is guest-first and one-page. Form state lives in the page client boundary, but shipping estimates, promotions, final totals, idempotency, and order creation stay server-owned.
- Payment methods are provider-neutral typed adapters. `mock_vnpay` is development-only and is not a production success signal.
