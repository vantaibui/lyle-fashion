# API integration

## Phase 11 development endpoints

Same-origin reference endpoints cover login/logout/forgot password, profile update, address create/delete, return submission, and guest tracking. Inputs are runtime validated. Private handlers authenticate through an opaque cookie, scope work to the session customer, and return private no-store responses.

These use in-process seed data and are not backend contracts. Production dependencies are identity/session lifecycle; customer/profile and consent versions; administrative divisions; address CRUD/versioning; durable wishlist and merge; paginated owned orders; carrier tracking; distributed lookup throttling; eligibility/reason/return/refund contracts; and deletion requests. Provider errors must map to stable public errors without forwarding raw payloads.

**Status:** APPROVED TRANSPORT FOUNDATION; endpoint contracts and providers remain DRAFT.

## Endpoint classes

| Class                    | Caller                                | Credentials                               | Cache baseline                                         |
| ------------------------ | ------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Public catalog/content   | Server Components/services            | Server token only if provider requires it | Explicit public tags/revalidation                      |
| Commerce backend         | Server-only module service            | Server secret/service identity            | Public reads may cache; mutations/private reads do not |
| CMS                      | Server-only content module            | Server preview/delivery credential        | Published tags; previews private/no-store              |
| Authenticated storefront | Narrow client -> same-origin endpoint | Secure cookie; never a bundled secret     | Private/no-store                                       |
| Provider callback        | Route handler                         | Signature/nonce per provider contract     | Never cached; validate raw input and idempotency       |

`apiRequest` supplies JSON accept headers, timeout/abort composition, safe-method retries, typed results, request ID capture and normalized errors. It does not assume a response envelope or validate unknown JSON: owning modules must use Zod at the trust boundary and map provider contracts into domain/view contracts.

`commerceServerRequest` is guarded by `server-only` and adds the server credential. `browserApiRequest` uses same-origin credentials and must call only approved application endpoints. It never receives the commerce token.

## Error contract

UI consumes `ApiError`, never raw backend payloads. Codes are `VALIDATION_ERROR`, `AUTHENTICATION_ERROR`, `AUTHORIZATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `INVENTORY_CONFLICT`, `PRICING_CONFLICT`, `RATE_LIMITED`, `NETWORK_ERROR`, `TIMEOUT` and `UNEXPECTED_SERVER_ERROR`. Provider adapters may map safe field details and a correlation ID; they must redact upstream messages and sensitive payloads.

Inventory/pricing conflicts are distinct domain outcomes and should trigger cart/checkout reconciliation, not blind retry. Retry is limited to idempotent safe reads and explicit transient errors. Mutations require an approved idempotency contract rather than transport retries.

## Contracts and validation

- Pagination uses positive page/page-size values and server-supplied totals; cursor pagination should get a separate provider contract rather than overloading page numbers.
- Route/search parameters are parsed through shared schemas. External API, CMS, form, payment callback and tracking schemas belong at their owning trust boundary.
- Forward an existing allowlisted request/correlation ID or accept one from the upstream response. Do not use IDs as authorization.
- Abort when a caller cancels or the timeout expires. A later payment/order status may still have succeeded; recovery queries must use the idempotency key/reference.
- Cache tags identify public resources only. Revalidation is a server-only operation and requires authenticated event handling once providers are selected.

## Search suggestion contract

`SearchSuggestionProvider` accepts a normalized Unicode query plus an AbortSignal and returns the standard data/error result. Results are separated into `products`, `categories`, `collections` and `keywords`; every suggestion has a stable ID, kind, localized label and internal destination. Provider output is validated before UI use.

The client waits 250ms and requires two normalized characters before requesting. It aborts replaced requests, sequences responses so stale requests cannot overwrite a newer query, and exposes loading, empty and normalized error states. Submission navigates to `/search?q=<encoded normalized query>`; empty input never creates a URL.

`searchSuggestionApi` is the production HTTP adapter foundation. `mockSearchSuggestionAdapter` is temporarily selected in `search-config.ts`; its category/collection/keyword concepts are explicit development fixtures and it returns no fake products, prices or availability. Replace the provider after approving the search endpoint, Vietnamese analysis/ranking, cache policy and response limits.

Recent searches are component-session memory only in this phase. Nothing is persisted to localStorage, and raw queries are not emitted to the analytics foundation. Events expose only allowlisted names and safe metadata such as group, destination, suggestion kind, result count or query length; vendor and consent adapters remain unselected.

## Catalog listing contract

`CatalogResultProvider` accepts a normalized server query and returns products, server pagination, total count, facets, optional option counts/disabled state and approved sort options. `CatalogLandingProvider` separately resolves shop, gender or collection editorial/SEO content. Both production responses pass Zod before UI use.

Supported query dimensions are gender, category, collection, material, style, color, size, availability, price tier and promotion. Values are URL-safe identifiers; customer labels and option availability come from facet metadata. The frontend does not assume every option is present or available.

The production catalog adapter uses an 8-second timeout and one safe-read retry. Public results are eligible for route-appropriate catalog/product/collection tags once backend cache semantics and webhook authentication are approved. Personalized values must never enter this result or shared cache.

`mockCatalogAdapter` is the temporary server-side provider. Its products, imagery, counts and landing copy are explicit development fixtures, not production catalog facts. Replace `catalogConfig` with the production adapters before launch.

Wishlist and Quick Add call same-origin browser boundaries. No storefront route handler is fabricated in this phase; until those endpoints exist, actions show normalized failure. The future cart endpoint must accept an explicit SKU and revalidate stock/price. The wishlist endpoint must define guest/account identity and merge policy.

PLP analytics names are `view_item_list`, `select_item`, `filter_products`, `sort_products`, `add_to_wishlist`, `quick_add` and `view_more_products`. Current adapter is a no-op pending vendor and consent approval; properties are allowlisted identifiers/counts and contain no personal data.

## Product detail and cart-intent foundation

The PDP uses a server-side `ProductDetailProvider` contract and a same-origin cart-intent boundary:

- `ProductDetailProvider` returns one product aggregate with color/size variants, SKU-level price and availability snapshots, editorial sections, optional fixed-bundle definition and recommendation summaries.
- Variant query parsing is defensive. Invalid `color` or `size` values must never crash or expose backend details; the route keeps the canonical product shell and falls back to a safe selection state.
- `POST /api/cart/lines` accepts a typed union:
  - simple line: `productId`, `skuId`, `quantity`
  - bundle line: `productId`, `bundleId`, `quantity`, `components[]`
- Bundle components are validated server-side against the fixed bundle definition. Missing or mismatched components are `VALIDATION_ERROR`; sold-out components are `INVENTORY_CONFLICT`.
- The current wishlist and cart-intent route handlers are local foundations for UI validation only. They are not production persistence or checkout authority.

## Cart and checkout foundation

Current same-origin commerce endpoints are foundation-only contracts:

- `GET /api/cart` returns the current authoritative cart snapshot, free-shipping progress, and an optional merge summary.
- `POST /api/cart/lines`, `PATCH /api/cart/lines/[lineId]`, and `DELETE /api/cart/lines/[lineId]` revalidate SKU/bundle state on the server and return the updated cart snapshot.
- `POST /api/cart/lines/[lineId]/move-to-wishlist` currently removes the line from cart and leaves wishlist persistence deferred.
- `POST /api/cart/promotions` and `DELETE /api/cart/promotions/[code]` are server-owned promotion boundaries. Current codes `DEV10`, `DEVSHIP`, `DEVEXPIRED`, and `DEVMIN` are development mocks for UI/error-path coverage only.
- `POST /api/cart/shipping-estimate` returns a lightweight development estimate. Production shipping quotes require approved provider contracts and logistics rules.
- `POST /api/checkout` requires `x-idempotency-key`, validates the checkout payload, confirms cart/shipping state, creates at most one order per attempt, and returns a safe application redirect to `/order-success`.

Remaining production dependencies: durable cart/order persistence, authenticated customer identity, backend merge orchestration, approved promotion engine, tax semantics, logistics quoting, real payment callbacks, and payment-status recovery rules.
