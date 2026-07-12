# Commerce module boundaries

Each child directory is a business capability boundary. Domain models, use cases, API adapters, and capability-specific UI stay inside their owning module. Modules must not import another module's internals; promote genuinely shared foundations to `src/lib`, `src/types`, or shared components only when reuse is demonstrated.

Add `api`, `components`, `contracts`, `mappers`, `schemas`, `services`, `types`, or `utils` only when a concrete integration needs them. Do not create symmetrical folders or barrel exports.

| Module          | Ownership boundary                                               |
| --------------- | ---------------------------------------------------------------- |
| `catalog`       | Browse taxonomy, filters and catalog result orchestration.       |
| `collection`    | Curated or rule-driven collection presentation.                  |
| `product`       | Product, variant and SKU presentation/orchestration.             |
| `search`        | Queries, suggestions and result orchestration.                   |
| `wishlist`      | Saved intent and guest/account reconciliation.                   |
| `cart`          | Server-owned cart, simple lines, bundles and reconciliation.     |
| `checkout`      | Contact, address, shipping, payment choice and order submission. |
| `customer`      | Customer profile, identity-facing contracts and addresses.       |
| `order`         | Order history, tracking, returns and refund-facing views.        |
| `promotion`     | Promotion presentation; evaluation remains backend-owned.        |
| `content`       | CMS-backed editorial, policy and material content.               |
| `store-locator` | Store search/list and store-data integration.                    |

The modules remain intentionally implementation-free until their contracts are approved. Do not add speculative products, prices, categories, collections, or checkout behavior.
