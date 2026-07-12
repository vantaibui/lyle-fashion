# Open questions and decisions

**Status: ACTIVE DRAFT — items here are not implementation authority.**

Resolve each item with an owner, decision date, evidence and affected contracts. `MVP blocker` means frontend feature implementation should not begin beyond prototypes/contracts.

## Product, taxonomy and content

| ID     | Question                                                                                                                        | Suggested owner                   | Impact               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------- |
| CAT-01 | Which system owns Product, ProductVariant and SKU IDs and publication state?                                                    | Product + Architecture            | MVP blocker          |
| CAT-02 | What is the approved category hierarchy, and how do gender/audience and garment type participate?                               | Merchandising + SEO               | MVP blocker          |
| CAT-03 | What precisely distinguishes Category, Collection, style tag and campaign?                                                      | Merchandising + SEO               | MVP blocker          |
| CAT-04 | Are collections manual, rule-driven, scheduled, or all three?                                                                   | Merchandising + Backend           | Phase decision       |
| CAT-05 | Is Tencel modeled as a branded Lyocell label, synonym or distinct customer-facing material? What trademark wording is approved? | Product + Legal                   | MVP content blocker  |
| CAT-06 | Are material percentages, origin, certifications, care and sustainability evidence required per product/component?              | Product + Legal                   | MVP content decision |
| CAT-07 | What product lifecycle states and publication approvals are required?                                                           | Merchandising + Operations        | MVP blocker          |
| CAT-08 | Which fields are mandatory before publication, including alt text, size/fit, care and SEO?                                      | Product + Content + Accessibility | MVP blocker          |
| CAT-09 | Are color/size combinations created manually or generated and then approved?                                                    | Merchandising + Backend           | MVP blocker          |
| CAT-10 | What are SKU code/barcode rules, and can SKU identity ever be reassigned?                                                       | Warehouse + Backend               | MVP blocker          |
| CAT-11 | What is the size system, ordering, measurement guide and fit-note policy?                                                       | Product + UX                      | MVP blocker          |
| CAT-12 | Which badges are allowed, who owns them, and can they imply availability or discount?                                           | Merchandising + Legal             | Phase decision       |

## Inventory, pricing and promotions

| ID       | Question                                                                                                            | Suggested owner                | Impact                 |
| -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------- |
| INV-01   | Which ERP/WMS/service owns inventory and available-to-sell?                                                         | Operations + Backend           | MVP blocker            |
| INV-02   | Is inventory aggregate or location-specific, and what is the availability formula?                                  | Warehouse + Backend            | MVP blocker            |
| INV-03   | When, if ever, is stock reserved: checkout start, order creation, payment initiation or confirmation? For how long? | Operations + Payment + Backend | MVP blocker            |
| INV-04   | Are backorder, preorder, overselling or safety-stock behavior permitted?                                            | Operations                     | MVP blocker            |
| INV-05   | What storefront availability labels/thresholds are allowed?                                                         | Merchandising + Operations     | MVP decision           |
| PRICE-01 | Are displayed prices tax-inclusive? Are VAT invoices required?                                                      | Finance + Legal                | MVP blocker            |
| PRICE-02 | What integer/minor-unit and rounding representation must APIs use for VND?                                          | Finance + Backend              | MVP blocker            |
| PRICE-03 | What do the 399k/699k/1.099m anchors mean operationally, and who approves deviations?                               | Product + Finance              | Planning decision      |
| PRICE-04 | Are compare-at prices permitted, and what substantiation/history is required?                                       | Legal + Marketing              | Phase decision         |
| PROMO-01 | Which promotion types are required for MVP: automatic, code, percentage, amount, shipping, bundle?                  | Marketing + Product            | MVP blocker            |
| PROMO-02 | What are stacking, exclusivity, priority, allocation, usage and refund rules?                                       | Marketing + Finance + Backend  | MVP blocker            |
| PROMO-03 | Who may create, approve, schedule, pause and rollback promotions?                                                   | E-commerce Manager + Security  | MVP operations blocker |

## Bundles

| ID     | Question                                                                                             | Suggested owner              | Impact                               |
| ------ | ---------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------ |
| BND-01 | Are fixed bundles with per-component size selection approved as MVP?                                 | Product + Operations         | MVP blocker                          |
| BND-02 | May a customer choose color per component, or are colors fixed by the curated set?                   | Merchandising                | MVP decision                         |
| BND-03 | Is bundle price fixed, derived from components, or promotion-calculated?                             | Finance + Backend            | MVP blocker                          |
| BND-04 | Can bundle price or eligibility vary by component selection?                                         | Product + Backend            | MVP blocker                          |
| BND-05 | What happens when one component sells out before checkout/fulfillment?                               | Operations + Product         | MVP blocker                          |
| BND-06 | Can promotions stack with bundle pricing, and how are discounts allocated to components?             | Finance + Marketing          | MVP blocker                          |
| BND-07 | Must customers return a whole bundle, or may components be returned? How is refund value calculated? | Legal + Operations + Finance | MVP launch blocker if bundles launch |
| BND-08 | Are substitutions, exchanges, partial cancellation or split fulfillment allowed?                     | Operations                   | Recommend no for MVP; confirm        |

## Cart and identity

| ID      | Question                                                                        | Suggested owner             | Impact          |
| ------- | ------------------------------------------------------------------------------- | --------------------------- | --------------- |
| CART-01 | What is guest cart expiry, sliding behavior and recovery policy?                | Product + Privacy + Backend | MVP blocker     |
| CART-02 | Where is the guest cart token stored, rotated and invalidated?                  | Security + Backend          | MVP blocker     |
| CART-03 | What per-SKU/per-cart quantity limits apply, and are they dynamic?              | Operations + Fraud          | MVP blocker     |
| CART-04 | Should duplicate SKU lines combine? Should identical Bundle selections combine? | Product                     | MVP decision    |
| CART-05 | What exact messages/actions apply to price, stock and promotion changes?        | Product + UX                | MVP blocker     |
| CART-06 | How long are removed/discontinued lines retained for explanation?               | Product + Backend           | MVP decision    |
| CART-07 | What concurrency/version-conflict strategy applies across tabs/devices?         | Backend + UX                | MVP blocker     |
| CART-08 | Is account/cart merge Phase 2, and what are quantity/promotion/winner rules?    | Product + Backend           | Phase 2 blocker |

## Checkout, address, shipping and payment

| ID       | Question                                                                                             | Suggested owner                | Impact             |
| -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------ |
| CHECK-01 | Which guest contact fields are mandatory and which must be verified?                                 | Product + Operations + Privacy | MVP blocker        |
| CHECK-02 | Which Vietnamese address dataset/provider is authoritative and how are changed legacy codes handled? | Operations + Backend           | MVP blocker        |
| CHECK-03 | Are free-text addresses allowed when provider data is unavailable?                                   | Shipping + Support             | MVP blocker        |
| CHECK-04 | Delivery-note limits and prohibited/sensitive content handling?                                      | Operations + Security          | MVP decision       |
| SHIP-01  | Which carriers/aggregator, regions, services, fees and ETA semantics are supported?                  | Logistics + Backend            | MVP blocker        |
| SHIP-02  | Are fees fixed, quoted, promotional or threshold-based? Are remote-area surcharges possible?         | Finance + Logistics            | MVP blocker        |
| SHIP-03  | Are split shipments, retries, pickup, return-to-sender or address changes supported?                 | Logistics + Support            | MVP policy blocker |
| PAY-01   | Will MVP support COD, online payment, or both? Which provider/methods?                               | Product + Finance              | MVP blocker        |
| PAY-02   | What are COD eligibility, limits, confirmation and failed-delivery policies?                         | Operations + Fraud + Finance   | MVP blocker        |
| PAY-03   | Does online payment authorize then capture, or capture immediately?                                  | Finance + Provider             | MVP blocker        |
| PAY-04   | What are payment session timeout, retry count, late-success and reconciliation rules?                | Finance + Backend              | MVP blocker        |
| PAY-05   | What idempotency scope/retention applies to checkout, payment attempts and callbacks?                | Backend + Payment              | MVP blocker        |
| PAY-06   | How does support recover an order created when the browser never received confirmation?              | Support + Backend              | MVP blocker        |

## Orders, fulfillment, cancellation, returns and refunds

| ID     | Question                                                                           | Suggested owner       | Impact                            |
| ------ | ---------------------------------------------------------------------------------- | --------------------- | --------------------------------- |
| ORD-01 | What order number format and guest lookup proof are approved?                      | Operations + Security | MVP blocker                       |
| ORD-02 | What confirms an order for COD versus online payment?                              | Operations + Finance  | MVP blocker                       |
| ORD-03 | Who may hold/cancel an order, at which states and with what compensation?          | Operations + Finance  | MVP blocker                       |
| ORD-04 | When does an order become completed?                                               | Operations            | MVP decision                      |
| FUL-01 | Are partial fulfillment and multiple shipments required?                           | Warehouse + Logistics | Recommend defer; confirm          |
| FUL-02 | Which carrier events are trusted and how are conflicts/manual corrections audited? | Logistics + Backend   | MVP blocker                       |
| RET-01 | Return window, eligible conditions, final-sale/hygiene rules and shipping payer?   | Legal + Operations    | MVP launch blocker                |
| RET-02 | Is exchange supported, or return/refund only?                                      | Product + Operations  | Recommend defer exchange; confirm |
| RET-03 | Required reason/evidence and inspection outcomes?                                  | Operations + Privacy  | MVP support blocker               |
| REF-01 | Refund destination and SLA for online payment and COD?                             | Finance + Payment     | MVP launch blocker                |
| REF-02 | Who approves partial/high-value refunds and how is allocation audited?             | Finance + Security    | MVP operations blocker            |

## Account, engagement and content

| ID       | Question                                                                                             | Suggested owner        | Impact                           |
| -------- | ---------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------- |
| ACC-01   | Identity provider, login methods, verification, recovery and session policy?                         | Security + Product     | Phase 2 blocker                  |
| ACC-02   | Account deletion, data export, anonymization and order-retention behavior?                           | Privacy + Legal        | Phase 2 blocker                  |
| WISH-01  | Does wishlist store Product or SKU/variant, and is guest wishlist allowed?                           | Product                | Phase 2 decision                 |
| RV-01    | Is recently viewed local, account-based or both; what consent/retention applies?                     | Product + Privacy      | Phase 2 blocker                  |
| REV-01   | Who may review, what moderation/evidence/appeal and aggregate-rating rules apply?                    | Content + Legal        | Phase 3 blocker                  |
| REC-01   | Rules-based or personalized recommendations; what consent and fallback?                              | Product + Privacy      | Phase 2/3 blocker                |
| CMS-01   | Which CMS/DAM owns product-support, blog, lookbook, Shop the Look, sustainability and store content? | Content + Architecture | MVP blocker for required content |
| CMS-02   | Localization, preview, publication, webhook/revalidation and rollback workflow?                      | Content + Platform     | MVP blocker                      |
| CMS-03   | What substantiation and approver are required for sustainability claims?                             | Legal + Content        | Content blocker                  |
| STORE-01 | Are physical stores in scope, and which system owns hours/services/coordinates?                      | Retail Operations      | Phase 3 decision                 |

## Search, SEO, analytics and privacy

| ID        | Question                                                                                     | Suggested owner        | Impact                 |
| --------- | -------------------------------------------------------------------------------------------- | ---------------------- | ---------------------- |
| SEARCH-01 | Which search engine/index and Vietnamese tokenization/synonym policy?                        | Product + Backend      | MVP blocker            |
| SEARCH-02 | Approved facets, sorts, suggestion sources, zero-result recovery and freshness SLA?          | Merchandising + Search | MVP blocker            |
| SEO-01    | Production hostname, locale/URL strategy and canonical category/product/collection taxonomy? | SEO + Architecture     | MVP blocker            |
| SEO-02    | Pagination, approved filter landing pages, redirect/404/archive and sitemap policy?          | SEO + Product          | MVP blocker            |
| SEO-03    | Which structured-data types and offer/availability update SLA are approved?                  | SEO + Backend          | MVP blocker            |
| AN-01     | Analytics/CMP vendors, lawful basis, consent categories and pre-consent behavior?            | Privacy + Marketing    | MVP blocker            |
| AN-02     | Approved event taxonomy, ID rules, attribution, retention and access?                        | Analytics + Privacy    | MVP blocker            |
| PRIV-01   | Data controller/contact, purposes, retention schedule and processor inventory?               | Legal + Privacy        | MVP launch blocker     |
| PRIV-02   | Marketing opt-in channel, proof, withdrawal and abandoned-cart eligibility?                  | Marketing + Privacy    | MVP blocker if used    |
| PRIV-03   | Data subject access/deletion/correction workflow and SLA?                                    | Privacy + Support      | MVP operations blocker |

## Admin, roles and platform

| ID      | Question                                                                                  | Suggested owner                    | Impact      |
| ------- | ----------------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| ADM-01  | Which operations are handled by provider tools versus a custom Admin application?         | Architecture + Operations          | MVP blocker |
| ADM-02  | Exact permission matrix, approval thresholds and separation of duties?                    | Security + Operations              | MVP blocker |
| ADM-03  | MFA/session/network requirements for staff and Super Administrator break-glass access?    | Security                           | MVP blocker |
| ADM-04  | Audit retention, export controls and monitoring/alert ownership?                          | Security + Legal                   | MVP blocker |
| TECH-01 | Hosting, backend, CMS, search, identity, payment and shipping environments/SLA ownership? | Architecture                       | MVP blocker |
| TECH-02 | API versioning, error schema, pagination, cache/revalidation and webhook contracts?       | Architecture + Backend             | MVP blocker |
| TECH-03 | Supported browsers/devices, performance budgets and accessibility conformance target?     | Product + Frontend + Accessibility | MVP blocker |
| TECH-04 | Notification providers/templates and transactional delivery requirements?                 | Operations + Content               | MVP blocker |

## Current phase backend gaps recorded during implementation

| ID      | Question                                                                                            | Suggested owner        | Impact      |
| ------- | --------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| IMPL-01 | Which durable store replaces the local in-memory cart and order foundation for multi-device use?    | Backend + Architecture | MVP blocker |
| IMPL-02 | Which session source identifies the current customer cart and triggers guest/account merge?         | Identity + Backend     | MVP blocker |
| IMPL-03 | Which shipping service returns authoritative methods, fees, ETA semantics and address restrictions? | Logistics + Backend    | MVP blocker |
| IMPL-04 | Which promotion engine owns validation, stacking, eligibility, and line-level discount allocation?  | Marketing + Backend    | MVP blocker |
| IMPL-05 | Which payment provider callbacks, signatures, replay rules, and recovery queries are approved?      | Payment + Backend      | MVP blocker |
| IMPL-06 | What is the approved public-safe order code and guest confirmation access-proof strategy?           | Operations + Security  | MVP blocker |

## Decision record template

When closing an item, record:

```text
Decision ID:
Decision:
Status: Approved | Rejected | Deferred
Owner / approver:
Date:
Evidence or policy link:
Affected APIs and documents:
Migration/backfill required:
Review date:
```
