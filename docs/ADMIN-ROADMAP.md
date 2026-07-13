# Admin roadmap

**Status: DRAFT — sequencing is a recommendation, not an approved delivery plan.**

This roadmap sequences the modules listed as "Not implemented" or "Partially implemented" in `docs/ADMIN-FUNCTIONAL-SCOPE.md`. It assumes Phase 12's foundation (shell, auth, authorization, dashboard placeholder, product-list, product-edit architecture, order-list, audit-log foundation) is the starting point. Do not begin a phase before its preconditions are met.

## Phase 13 (recommended next): product mutations and inventory adjustment

- Wire product create/save/publish/unpublish/archive/restore to a real (or contract-approved mock) commerce backend endpoint.
- Wire variant create/edit with server-side SKU and color/size-combination uniqueness enforcement (the client-side check added in Phase 12 becomes a UX hint, not the authority).
- Wire inventory adjustment with a required reason code and an append-only adjustment history, per "inventory changes must be server-authorized... and audited."
- Emit the corresponding audit events already defined in `src/modules/admin-auth/contracts/audit-log.ts` (`product.created`, `product.updated`, `product.published`, `product.archived`, `variant.updated`, `inventory.adjusted`).
- **Precondition:** an approved PIM/commerce backend contract for product/variant/inventory mutation (currently only a read-shaped mock exists).

## Phase 14: order actions

- Confirm, cancel, mark-processing, pack, ship, update-tracking, mark-delivered actions, each permission-gated and restricted to the documented legal transitions in `docs/STATUS-TRANSITIONS.md`.
- Refund initiation (separate from execution) gated to the `order.refund` permission.
- Emit `order.status_changed` and `refund.initiated` audit events.
- **Precondition:** an approved OMS backend contract with the transition guards in `docs/STATUS-TRANSITIONS.md` implemented server-side, and `docs/OPEN-QUESTIONS.md` items on cancellation/refund policy resolved.

## Phase 15: taxonomy (categories, collections, materials, colors, sizes)

- Replace the Phase 12 product-taxonomy section's raw-identifier inputs with real CRUD-backed selection (comboboxes against approved vocabularies).
- **Precondition:** `docs/BUSINESS-RULES.md`'s open taxonomy questions (category/collection/style ownership, Tencel/Lyocell labeling) resolved.

## Phase 16: media

- Product media upload/ordering/alt-text/variant assignment.
- **Precondition:** approved CDN/object-storage contract, MIME/size validation policy, and content-scanning approach per `docs/SECURITY-GUIDELINES.md`'s "Uploads remain disabled until authenticated object access, content scanning, MIME verification... are approved."

## Phase 17: promotions

- Promotion list/create/update/activate, gated to the `promotion.*` permissions already defined.
- **Precondition:** an approved promotion engine/provider and stacking rules (`docs/BUSINESS-RULES.md` marks this fully open).

## Phase 18: returns and refunds operations

- Return review/approval/inspection workflow and refund execution, independent of the Phase 14 refund-initiation gate.
- **Precondition:** approved return/refund policy and RMA/WMS contract (`docs/ECOMMERCE-FUNCTIONAL-SCOPE.md` marks policy, RMA/OMS/WMS as open).

## Phase 19: customers

- Read/update customer profile and address data with masking rules matching `docs/SECURITY-GUIDELINES.md`'s PII-minimization requirements.
- **Precondition:** approved customer-data access policy for staff roles beyond what `customer.read`/`customer.update` currently gate in the abstract.

## Phase 20: content (CMS, homepage, mega menu, journal, lookbook)

- **Precondition:** CMS vendor/model decision (`docs/SEO-STRATEGY.md`/`docs/DESIGN-SYSTEM.md` CMS-adjacent open items) — do not build a bespoke CMS ahead of that decision.

## Phase 21: store locator, admin-user management, reports, system settings

- Admin-user management depends on the roles/permissions data model already shipped in Phase 12 (`docs/ADMIN-PERMISSIONS.md`) — this phase adds the UI and the `admin-user.manage` mutation endpoint.
- Reports and system settings have no scope definition yet; do not build ahead of a product brief for these.

## Cross-cutting precondition for every phase above

`ADM-01` and `ADM-03` in `docs/OPEN-QUESTIONS.md` (provider tools vs. custom admin ownership per module; staff MFA/session/network requirements) remain open. Phase 12's admin authentication is a self-contained development fixture, not production-ready identity. No phase above should treat staff authentication as solved without an explicit identity-provider decision — see `docs/ADMIN-ARCHITECTURE.md`'s authentication boundary section.

## Out of scope indefinitely, pending explicit product decision

Full analytics-provider integration and a final production security audit are explicitly excluded from this roadmap's phases — they follow feature completion, not precede it, per this task's "Do not implement... Analytics provider integration... Final production audit."
