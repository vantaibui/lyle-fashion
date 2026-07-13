# Admin roles and permissions

**Status: DRAFT — role-to-permission defaults are a recommended least-privilege starting point pending business approval, not confirmed policy.**

## Source of truth

Roles: `src/modules/admin-auth/contracts/role.ts` (`adminRoles`).
Permissions: `src/modules/admin-auth/contracts/role.ts` (`adminPermissions`).
Role → permission mapping: `src/modules/admin-auth/contracts/role.ts` (`rolePermissions`).

Do not duplicate this list elsewhere; update the owning file and this document's narrative only.

## Roles

Derived from `docs/ECOMMERCE-FUNCTIONAL-SCOPE.md`'s "Roles and recommended responsibility boundaries" table, normalized to fixed machine-readable identifiers:

| Role                | Normalized from                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `SUPER_ADMIN`       | Super Administrator                                                                                                                   |
| `ADMIN`             | Administrator                                                                                                                         |
| `ECOMMERCE_MANAGER` | E-commerce Manager                                                                                                                    |
| `MERCHANDISER`      | Merchandiser                                                                                                                          |
| `CONTENT_EDITOR`    | Content Editor                                                                                                                        |
| `MARKETING`         | Marketing                                                                                                                             |
| `ORDER_OPERATOR`    | Order Operator                                                                                                                        |
| `WAREHOUSE_STAFF`   | Warehouse Staff                                                                                                                       |
| `CUSTOMER_SUPPORT`  | Customer Support                                                                                                                      |
| `VIEWER`            | New: read-only access across implemented domains, for audit/observer use cases not explicitly named in the functional scope document. |

## Permissions

Permissions are `<resource>.<action>` strings, defined independently of roles so authorization checks never hard-code a role name:

```text
product.read       product.create      product.update
product.publish    product.archive

inventory.read     inventory.update    inventory.adjust

order.read         order.update        order.cancel
order.fulfill      order.refund

promotion.read      promotion.create   promotion.update
promotion.activate

content.read        content.create     content.update
content.publish

customer.read        customer.update

admin-user.read       admin-user.manage

audit-log.read
```

## Role → permission matrix

| Permission         | SUPER_ADMIN | ADMIN | ECOMMERCE_MANAGER | MERCHANDISER | CONTENT_EDITOR | MARKETING | ORDER_OPERATOR | WAREHOUSE_STAFF | CUSTOMER_SUPPORT | VIEWER |
| ------------------ | ----------- | ----- | ----------------- | ------------ | -------------- | --------- | -------------- | --------------- | ---------------- | ------ |
| product.read       | ✓           | ✓     | ✓                 | ✓            | ✓              |           |                |                 |                  | ✓      |
| product.create     | ✓           | ✓     |                   | ✓            |                |           |                |                 |                  |        |
| product.update     | ✓           | ✓     | ✓                 | ✓            |                |           |                |                 |                  |        |
| product.publish    | ✓           | ✓     | ✓                 | ✓            |                |           |                |                 |                  |        |
| product.archive    | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| inventory.read     | ✓           | ✓     | ✓                 | ✓            |                |           |                | ✓               |                  | ✓      |
| inventory.update   | ✓           | ✓     | ✓                 |              |                |           |                | ✓               |                  |        |
| inventory.adjust   | ✓           | ✓     |                   |              |                |           |                | ✓               |                  |        |
| order.read         | ✓           | ✓     | ✓                 |              |                |           | ✓              | ✓               | ✓                | ✓      |
| order.update       | ✓           | ✓     | ✓                 |              |                |           | ✓              |                 |                  |        |
| order.cancel       | ✓           | ✓     |                   |              |                |           | ✓              |                 |                  |        |
| order.fulfill      | ✓           | ✓     |                   |              |                |           | ✓              |                 |                  |        |
| order.refund       | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| promotion.read     | ✓           | ✓     | ✓                 |              |                | ✓         |                |                 |                  | ✓      |
| promotion.create   | ✓           | ✓     | ✓                 |              |                | ✓         |                |                 |                  |        |
| promotion.update   | ✓           | ✓     | ✓                 |              |                |           |                |                 |                  |        |
| promotion.activate | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| content.read       | ✓           | ✓     | ✓                 | ✓            | ✓              | ✓         |                |                 |                  | ✓      |
| content.create     | ✓           | ✓     |                   |              | ✓              | ✓         |                |                 |                  |        |
| content.update     | ✓           | ✓     |                   |              | ✓              |           |                |                 |                  |        |
| content.publish    | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| customer.read      | ✓           | ✓     | ✓                 |              |                |           | ✓              |                 | ✓                | ✓      |
| customer.update    | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| admin-user.read    | ✓           | ✓     |                   |              |                |           |                |                 |                  |        |
| admin-user.manage  | ✓           |       |                   |              |                |           |                |                 |                  |        |
| audit-log.read     | ✓           | ✓     | ✓                 |              |                |           |                |                 |                  |        |

Notable least-privilege decisions baked into the defaults:

- Only `SUPER_ADMIN` can manage other admin users (`admin-user.manage`), matching "separation of duties for high-risk... roles" in `docs/ECOMMERCE-FUNCTIONAL-SCOPE.md`.
- `order.refund` is restricted to `SUPER_ADMIN`/`ADMIN`, not `ORDER_OPERATOR`, matching "no unrestricted refund authority" for support/operator roles.
- `WAREHOUSE_STAFF` gets inventory permissions but no `product.publish`/`product.create`, matching "no catalog publication."
- `CUSTOMER_SUPPORT` gets `order.read`/`customer.read` only — no inventory or update permissions, matching "no direct inventory or unrestricted refund authority."
- `MARKETING` gets promotion read/create but not `promotion.activate`, keeping activation with managers/admins.

These defaults are recommendations. Business/security must approve the final matrix — see `docs/OPEN-QUESTIONS.md` `ADM-01`/`ADM-03` — before this governs production access.

## Enforcement points

Permissions are enforced server-side at every layer; UI filtering is a convenience only:

1. **Server Components** call `requirePagePermission(session, permission)` (`src/modules/admin-auth/server/require-admin-permission.ts`), which redirects to `/admin/forbidden` if the session lacks the permission.
2. **Route handlers / Server Actions** (once mutation endpoints exist) must call `assertAdminPermission(session, permission)`, which throws `ApiError('AUTHORIZATION_ERROR', 403)`.
3. **Navigation** filters via the pure `hasAdminPermission(session, permission)` (`src/modules/admin-auth/contracts/session.ts`) — usable from both client and server code since it takes an already-resolved `AdminSession`, not cookies.
4. **Field-level restrictions**: the product-edit form disables (`<fieldset disabled>`) all editable sections when the session lacks `product.update`, rather than hiding them — the data remains visible (least-surprise for read-only viewers) but not editable. This is a `disabled` attribute, not a substitute for the server enforcing the same check on save once a save endpoint exists.

## What is not yet enforced

Mutation endpoints (product save/publish/archive, inventory adjust, order status transitions, admin-user management) do not exist in this phase — see `docs/ADMIN-ROADMAP.md`. `assertAdminPermission` is defined and unit-testable now so those endpoints have zero additional authorization design work when built; it is not yet called from any route because no mutation route exists yet.
