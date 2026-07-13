# Admin architecture

**Status: PHASE 12 FOUNDATION — domain integrations remain DRAFT.**

See `docs/ADMIN-ARCHITECTURE-DECISION.md` for the full options analysis and the recorded decision to build admin as a route group inside the existing Next.js application (Option A) rather than a monorepo, along with the accepted risks and the migration trigger for revisiting that decision.

## Repository structure

Admin code follows the same `src/app` / `src/modules` / `src/components` / `src/design-system` split as the storefront, with an `admin-*` module prefix to keep ownership obvious:

```text
src/app/(admin)/admin/
  login/                    # staff login, no shell chrome
  forbidden/                # permission-denied state
  page.tsx                  # dashboard
  products/                 # product-list + product-detail routes
  orders/                   # order-list + read-only order-detail routes
  audit-log/                # audit-log route

src/app/api/admin/auth/     # staff login/logout route handlers

src/modules/
  admin-auth/                # roles, permissions, session, navigation, audit-log contracts
  admin-shell/                # AdminShell, AdminNav, AdminTopbar, shared states
  admin-dashboard/            # dashboard snapshot contract + mock adapter
  admin-product/              # product-list + product-detail + variant/inventory
  admin-order/                 # order-list + read-only order-detail
  admin-audit/                 # audit-log page service
```

`src/app/(storefront)` and `src/app/(account)` gained their own `layout.tsx` files in this phase (both render the shared `PublicSiteChrome` — the storefront header, skip link, and organization/website JSON-LD). The root `src/app/layout.tsx` now only owns `<html>/<body>`. This was necessary because the previous single root layout unconditionally rendered the public storefront header on every route, including `/admin/*`, which is both a UX defect (staff surface wrapped in customer navigation) and a security smell for a surface required to be authenticated and non-indexable.

## Route group vs. `(storefront)` / `(account)`

`(admin)` is a third top-level route group, structurally parallel to `(storefront)` and `(account)`, and does not nest inside either. It has no `layout.tsx` of its own beyond `error.tsx`/`loading.tsx` boundaries — every admin page composes `AdminShell` directly (mirroring how `(account)` pages compose `AccountShell` directly rather than through a layout file), so the shell only wraps content once a session and its permissions are known.

## Authentication boundary

Admin authentication is a separate, self-contained development adapter (`src/modules/admin-auth/server/admin-auth-store.ts`) — **not** a shared identity provider with the storefront customer session:

|                   | Storefront/account                            | Admin                                               |
| ----------------- | --------------------------------------------- | --------------------------------------------------- |
| Cookie name       | `lyle_session`                                | `lyle_admin_session`                                |
| Cookie `SameSite` | `Lax`                                         | `Strict`                                            |
| Session TTL       | 8 hours                                       | 4 hours                                             |
| Session shape     | `{ customerId, expiresAt }`                   | `{ adminUserId, expiresAt, role, permissions }`     |
| Guard function    | `requireAuth`                                 | `requireAdminAuth`                                  |
| Credential store  | `src/modules/account/server/account-store.ts` | `src/modules/admin-auth/server/admin-auth-store.ts` |

Neither guard accepts the other's cookie — this is asserted directly in `src/modules/admin-auth/server/admin-auth-store.test.ts`. See `docs/AUTHENTICATION.md` for the storefront side and the "Admin authentication" section below for what remains open.

### A note on the in-memory dev session store

`getAdminSession` reconstructs the session from the fixed development token on every call rather than depending solely on a lookup into the in-process `sessions` Map (mirroring `account-store.ts`'s equivalent behavior). This was a real bug found and fixed during this phase: Next.js dev (and most production deployments) can run multiple worker processes, so a session written to one worker's in-memory `Map` is not guaranteed visible to the worker that serves the next request. A durable production identity store must not repeat this constraint — it needs real shared session storage, not a per-process map. One accepted consequence of this fixture-only trade-off: `endAdminSession` cannot make the fixed demo token stop authenticating; only clearing the browser's cookie prevents it from being resent. This is documented inline at the definition site.

## Authorization: roles and permissions

Permissions are defined independently of roles (`src/modules/admin-auth/contracts/role.ts`) and enforced server-side, never by hiding a UI control. See `docs/ADMIN-PERMISSIONS.md` for the full role/permission matrix and enforcement points.

## Navigation

`src/modules/admin-auth/contracts/navigation.ts` defines navigation groups as data (`AdminNavGroup[]`), each item carrying the `AdminPermission` required to see it. `AdminNav` (desktop sidebar) and `AdminMobileNav` (drawer, `<lg`) both filter through `hasAdminPermission` before rendering, so an unauthorized route never appears as a link — though navigation filtering is a UX convenience, not the authorization boundary itself; every route also calls `requirePagePermission` server-side.

## Shell

`AdminShell` (`src/modules/admin-shell/components/admin-shell.tsx`) composes:

- Skip link to `#admin-main-content`.
- `AdminTopbar`: product name, non-production environment badge (from `NODE_ENV`, never a secret), role label, logout.
- `AdminMobileNav`: drawer-based nav trigger, `<lg` only.
- `AdminNav`: permission-filtered sidebar, `≥lg` only.
- `Breadcrumb` (optional per page) + `<h1>` page title + `main` landmark.

Shared states: `AdminRouteLoading`, `AdminRouteError` (wired as `(admin)/loading.tsx` and `(admin)/error.tsx`), and `AdminForbidden` (rendered by `/admin/forbidden`, reached via `requirePagePermission`'s redirect).

## Data provider pattern

Every admin domain module follows the same typed-provider pattern already established by `src/modules/catalog` and `src/modules/product`:

```text
contracts/<domain>.ts       # provider function type + result/query types
api/mock-<domain>-adapter.ts # development fixture implementing the provider type
<domain>-config.ts           # single adapter-selection point (swap here for production)
services/<domain>-page.ts    # React cache()-wrapped orchestration for a route
components/                   # presentation
```

This keeps the eventual backend swap a matter of writing a new adapter file and updating one config object — no call-site changes. See `docs/API-INTEGRATION.md` for the admin endpoint classes this phase adds.

## What this phase does not implement

Per the approved initial scope, the following are explicitly out of scope and must not be inferred as working: product create/publish/archive mutations (buttons render but are not wired to a save endpoint), inventory adjustment mutations, order status-transition actions (confirm/cancel/fulfill/refund), bulk table actions, media upload, promotions, CMS, customer management, reports, and system settings. See `docs/ADMIN-ROADMAP.md`.
