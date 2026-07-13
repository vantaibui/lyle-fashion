# Security guidelines

## Phase 11 customer-data controls

- Account, address, authenticated wishlist, order, return, refund, and tracking responses are private and `no-store`; shared caching is prohibited.
- Protected pages authenticate on the server. Endpoints repeat authentication and resource-ownership checks.
- Login return URLs are restricted to local paths. Session IDs are opaque, `HttpOnly`, same-site cookies and never browser-storage values.
- Forgot-password and guest-tracking failures are generic. Production must add distributed rate limiting, timing normalization, monitoring, and abuse response.
- Analytics must not contain email, phone, address, lookup input, tokens, order contact data, evidence, or sensitive notes.
- Account deletion needs re-authentication, legal retention, and auditable asynchronous processing; the frontend cannot erase order records.
- Uploads remain disabled until authenticated object access, content scanning, MIME verification, safe names, quotas, retention, and deletion are approved.

The in-memory Phase 11 adapter and rate limiter are development-only. They do not provide durability, cross-instance isolation, credential security, or production abuse protection.

## Browser and transport foundation

Next.js applies CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and frame protection. Development alone permits eval and WebSocket connections for tooling. Inline scripts/styles remain a known compromise; move to nonce-based CSP after deployment/runtime architecture is approved. Validate headers at the final CDN/host.

Remote image hosts stay closed until exact HTTPS CDN paths are approved. Transport wrappers use bounded timeouts and safe-method retries; TLS, host allowlists and provider authentication remain deployment responsibilities.

## Trust boundaries

- Validate route/search/form/API/CMS/callback input at entry. Validation is not authorization.
- Server secrets live only in the `server-only` environment/client path. Browser calls use same-origin credentials and never receive provider tokens.
- Redirects pass `getSafeRedirect`; do not accept schemes, protocol-relative URLs or external origins.
- Private routes and authenticated/guest commerce data use dynamic, private/no-store responses and never shared cache tags.
- JSON-LD uses the safe serializer and server-validated visible facts. CMS rich HTML requires an approved schema, sanitizer, allowed URL protocol list and media policy before rendering.

## Commerce and privacy controls

Cart, checkout, payment, tracking and customer actions require server-side authentication/authorization where applicable, ownership checks, authoritative price/inventory validation and abuse controls. Hiding a client control is not authorization.

State-changing cookie-authenticated endpoints require a CSRF decision: SameSite cookies, origin/fetch-metadata verification and anti-CSRF tokens where the chosen flow needs them. Payment callbacks require provider signature verification over the required raw payload, replay/timestamp defense, amount/order binding and idempotency; no provider is selected yet.

Guest order tracking must verify sufficient private proof, rate limit attempts and return indistinguishable failure responses so order existence is not disclosed. Never place references or proof tokens in analytics, logs or public caches.

## Environment and logging

Only non-secret `NEXT_PUBLIC_*` values may enter client bundles. `.env*` files are ignored except `.env.example`.

Never log credentials, tokens, cookies, authorization headers, payment data, personal data, addresses, raw form bodies, tracking proof or full upstream responses. Log allowlisted event names, correlation IDs, safe error codes and redacted operational context. Route boundaries currently log only the framework digest.

Authentication, RBAC, CSRF implementation, rate limiting, privacy/retention, consent, monitoring, dependency scanning and incident response require backend/deployment decisions. Threat-model checkout, payment callbacks, previews and all personal-data flows before implementation.

## Admin authentication and authorization controls

- Admin staff sessions are structurally isolated from storefront customer sessions: separate cookie name (`lyle_admin_session` vs. `lyle_session`), separate session contract, separate credential store (`src/modules/admin-auth/server/admin-auth-store.ts`). Neither `requireAuth` nor `requireAdminAuth` accepts the other's cookie; this is unit-tested.
- Admin session cookie uses `SameSite=Strict` (stricter than the storefront's `Lax`) and a shorter 4-hour TTL, reflecting the higher sensitivity of staff access.
- Every admin route calls `requireAdminAuth` (redirects to `/admin/login` when unauthenticated) and, where the route is permission-scoped, `requirePagePermission` (redirects to `/admin/forbidden` when authenticated but unauthorized). These are distinct states by design, matching "distinguish no data from denied access."
- Permissions are enforced server-side via `assertAdminPermission`/`requirePagePermission`, never by hiding a UI control. Navigation filtering (`hasAdminPermission`) is a UX convenience only.
- The current admin authentication adapter is an explicit development fixture, isolated from the storefront's, and must not receive real staff credentials. Production requires an approved staff identity provider with MFA, session, and network requirements (`docs/OPEN-QUESTIONS.md` `ADM-01`/`ADM-03`) before any real admin access is granted.
- Admin routes set `robots: { index: false, follow: false }` via `createRouteMetadata`'s default `indexable: false`, and mutating/private admin API responses use `Cache-Control: private, no-store`, matching the storefront's private-route pattern.
- Order-list and order-detail views expose only masked customer summaries (e.g., `"Khách hàng L*** (090***4567)"`), not full name/phone/email/address, per "do not expose unnecessary PII in list views."
- The audit-log contract (`src/modules/admin-auth/contracts/audit-log.ts`) restricts `safeSummary`/`previousValue`/`newValue` to fields approved for audit exposure; it must never carry secrets, payment data, or full customer PII. The current in-memory store is a development-only foundation with the same durability/cross-instance caveats as the Phase 11 storefront adapters — see the inline documentation at `src/modules/admin-auth/server/admin-auth-store.ts` for a specific multi-worker in-memory session caveat found and fixed during Phase 12.

## Cart and checkout foundation controls

- Guest cart identity uses an opaque httpOnly cookie. Browser code does not store payment data, full address, phone, email, customer identity, or secrets for cart restoration.
- Cart, checkout, and order-success data are private and must never enter shared caches. Order confirmation access currently requires both a public-safe order code and a server-issued access cookie from the same session.
- Checkout requires an idempotency key and must replay the same durable order result for duplicate retries of one attempt.
- Redirect targets remain same-origin and app-owned. Query parameters alone are not trusted as proof of payment success.
- Development payment adapters must remain visibly non-production and must not be treated as verified provider callbacks.
