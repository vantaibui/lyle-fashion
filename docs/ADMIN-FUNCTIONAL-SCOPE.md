# Admin functional scope

**Status: DRAFT — full module list is directional planning, not an implementation commitment.**

This document lists the full admin functional surface from the approved planning brief and marks what Phase 12 implements versus defers. It complements `docs/ECOMMERCE-FUNCTIONAL-SCOPE.md`'s "Admin" row, which already establishes that a custom storefront admin is not automatically assumed to own every operational capability (`ADM-01` in `docs/OPEN-QUESTIONS.md` is still open).

## Full planned module list

```text
Dashboard                  Product management        Product variants
SKU management              Inventory                  Categories
Collections                  Materials                  Colors
Sizes                          Product media              Product badges
Pricing                       Promotions                 Orders
Fulfillment                   Returns                     Refunds
Customers                     CMS                          Homepage content
Mega menu                     Journal                     Lookbook
Store locator                 Admin users                 Roles
Permissions                   Audit log                   Reports
System settings
```

## Phase 12 implementation status

| Module                           | Status                           | Notes                                                                                                                                                                                   |
| -------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin application shell          | **Implemented**                  | `AdminShell`, topbar, permission-aware nav, breadcrumbs, skip link, responsive drawer.                                                                                                  |
| Admin authentication boundary    | **Implemented (dev foundation)** | Separate cookie/session from storefront; production identity provider is open (`ADM-01`/`ADM-03`).                                                                                      |
| Admin authorization foundation   | **Implemented**                  | Roles, permissions, `requirePagePermission`/`assertAdminPermission`. See `docs/ADMIN-PERMISSIONS.md`.                                                                                   |
| Dashboard                        | **Implemented (placeholder)**    | Typed `DashboardSnapshotProvider`; mock adapter returns zeroed operational counters (no fabricated metrics) plus real audit-log entries.                                                |
| Product management (list)        | **Implemented**                  | Server-paginated, filterable, sortable list with status/category/collection/material filters.                                                                                           |
| Product management (create/edit) | **Partially implemented**        | Sectioned edit workspace (basic info, taxonomy, variants/inventory, SEO, publishing); read-only display, no save/publish mutation wired yet.                                            |
| Product variants                 | **Partially implemented**        | Display + client-side duplicate-SKU/duplicate-combination detection; no create/edit mutation.                                                                                           |
| SKU management                   | **Partially implemented**        | Displayed within the variant table; no standalone SKU CRUD.                                                                                                                             |
| Inventory                        | **Partially implemented**        | On-hand/reserved/safety-stock display with low-stock highlighting; no adjustment mutation or reason/history capture.                                                                    |
| Categories                       | Not implemented                  | Product taxonomy section accepts a raw category identifier; no category CRUD/hierarchy UI.                                                                                              |
| Collections                      | Not implemented                  | Product taxonomy section accepts raw collection identifiers; no collection CRUD.                                                                                                        |
| Materials                        | Not implemented                  | Product taxonomy section accepts raw material identifiers; no material vocabulary CRUD.                                                                                                 |
| Colors                           | Not implemented                  | Variant color is display-only from the mock fixture.                                                                                                                                    |
| Sizes                            | Not implemented                  | Variant size is display-only from the mock fixture.                                                                                                                                     |
| Product media                    | Not implemented                  | No upload UI; explicitly deferred per task scope (media upload foundation requires an approved CDN/upload contract).                                                                    |
| Product badges                   | Not implemented                  |                                                                                                                                                                                         |
| Pricing                          | Not implemented (display only)   | Variant price/compare-at fields are displayed; no pricing edit/history.                                                                                                                 |
| Promotions                       | Not implemented                  |                                                                                                                                                                                         |
| Orders (list)                    | **Implemented**                  | Server-paginated, filterable by order/payment/fulfillment status and order code. PII-minimized (masked customer summary).                                                               |
| Orders (detail)                  | **Partially implemented**        | Read-only summary card; no status-transition actions.                                                                                                                                   |
| Fulfillment                      | Not implemented                  | Status is displayed on the order list/detail; no fulfillment action.                                                                                                                    |
| Returns                          | Not implemented                  |                                                                                                                                                                                         |
| Refunds                          | Not implemented                  |                                                                                                                                                                                         |
| Customers                        | Not implemented                  |                                                                                                                                                                                         |
| CMS                              | Not implemented                  |                                                                                                                                                                                         |
| Homepage content                 | Not implemented                  |                                                                                                                                                                                         |
| Mega menu                        | Not implemented                  |                                                                                                                                                                                         |
| Journal                          | Not implemented                  |                                                                                                                                                                                         |
| Lookbook                         | Not implemented                  |                                                                                                                                                                                         |
| Store locator                    | Not implemented                  |                                                                                                                                                                                         |
| Admin users                      | Not implemented                  | Role/permission model exists (`docs/ADMIN-PERMISSIONS.md`); no admin-user management UI.                                                                                                |
| Roles                            | **Implemented (data model)**     | Defined as data, not yet editable through UI.                                                                                                                                           |
| Permissions                      | **Implemented (data model)**     | Defined as data, not yet editable through UI.                                                                                                                                           |
| Audit log                        | **Implemented (foundation)**     | Contract, in-memory dev store, and read-only list page; write side only records `admin.login`/`admin.logout` today since no mutation endpoints exist yet to emit the other event types. |
| Reports                          | Not implemented                  |                                                                                                                                                                                         |
| System settings                  | Not implemented                  |                                                                                                                                                                                         |

## Acceptance-criteria compliance for implemented modules

Per `docs/ECOMMERCE-FUNCTIONAL-SCOPE.md`'s "Admin and operations" acceptance criteria:

- **Loading/empty/error:** every implemented list/detail route has a distinct loading (`AdminRouteLoading`), empty (`EmptyState` with a specific message), and error (`ErrorState`) state — verified in `tests/e2e/admin-phase12.spec.ts` and by direct review of each route file.
- **Unauthorized vs. denied:** `requireAdminAuth` (no session → `/admin/login`) is distinct from `requirePagePermission` (session lacks permission → `/admin/forbidden`), matching "distinguish no data from denied access."
- **Server authorization:** every implemented route calls `requireAdminAuth` and the relevant `requirePagePermission` before rendering; no route relies on client-side hiding.
- **Audit evidence:** login/logout are audited now; the audit contract (`docs/ADMIN-PERMISSIONS.md`-adjacent `src/modules/admin-auth/contracts/audit-log.ts`) defines the full event vocabulary so mutation endpoints built later attach to an already-reviewed shape.
- **Desktop-first, responsive fallback:** admin is styled for data density at `≥1024px`; narrower viewports get a drawer-based nav and horizontally-scrollable tables rather than a claim of full mobile optimization.

## What is explicitly deferred

Every module marked "Not implemented" above, plus: bulk table actions, media upload, product duplicate/publish/unpublish/archive/restore mutations, inventory adjustment mutations, order status-transition actions, and any analytics/observability event emission beyond what already exists in the storefront's shared error boundary pattern. See `docs/ADMIN-ROADMAP.md` for suggested phase ordering.
