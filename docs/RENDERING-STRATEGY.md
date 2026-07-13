# Rendering strategy

**Status:** APPROVED FOUNDATION; durations and publishing integrations remain DRAFT.

All routes remain `noindex` until launch prerequisites in `SEO-STRATEGY.md` are approved. Placeholder routes contain no fake commerce content.

> **Academic demo note:** `/` currently renders an elise.vn-styled homepage with demo
> content instead of a placeholder. This is a non-production course exercise; see
> `ELISE-REDESIGN.md`. It does not change the approved rendering targets below.

| Route                                | Rendering and cache               | Revalidation                         | Personalization / SEO                                           | Error behavior                                              |
| ------------------------------------ | --------------------------------- | ------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------- |
| `/`                                  | ISR target                        | Time-based after CMS contract        | Public; canonical and indexable only at launch                  | Storefront loading/error; CMS fallback                      |
| `/shop`, `/men`, `/women`            | ISR target                        | Catalog tags plus approved interval  | Public taxonomy; filtered URLs handled separately               | Preserve shell; explicit unavailable/empty states           |
| `/collections/[slug]`                | ISR, currently 15 min placeholder | Collection/content tags on publish   | Public only for published canonical slugs                       | Invalid slug or missing content -> 404                      |
| `/product/[slug]`                    | ISR, currently 15 min placeholder | Product/catalog tags; webhook target | Server-visible facts; schema must match current validated offer | Invalid/missing -> 404; stale commerce facts never asserted |
| `/search`                            | Dynamic SSR                       | No shared route cache                | Query may be sensitive; always non-indexable                    | Keep query, expose safe retry/zero results                  |
| `/wishlist`                          | Dynamic/private                   | No shared cache                      | Identity-dependent; non-indexable                               | Preserve last confirmed state; authenticate where required  |
| `/cart`, `/checkout`                 | Dynamic/private                   | No-store for customer data           | Guest/customer data; non-indexable                              | Reconcile server state; recover idempotently                |
| `/order-success`, `/order-tracking`  | Dynamic/private                   | No shared cache                      | Token/verification protected; non-indexable                     | Do not disclose order existence before verification         |
| `/account/**`                        | Dynamic/private                   | No shared cache                      | Authenticated and authorized; non-indexable                     | Login/forbidden/not-found chosen server-side                |
| `/lookbook`                          | SSG/ISR target                    | CMS publish tags                     | Index only approved published content                           | Editorial absence must not break commerce                   |
| `/journal`, `/journal/[slug]`        | SSG/ISR; article placeholder 1 hr | CMS publish tags                     | Canonical Article metadata only from CMS                        | Invalid/missing/unpublished -> 404                          |
| `/material-guide`, `/sustainability` | SSG/ISR target                    | CMS publish tags                     | Claims require content/legal approval                           | Safe content unavailable state                              |
| `/stores`                            | SSG/ISR list target               | Store-data publish tags              | Only approved locations get LocalBusiness data                  | List fallback; map never required                           |
| `/contact`                           | SSG target                        | Deploy/content publish               | Public; avoid exposing personal submissions                     | Submission errors are recoverable and private               |
| Policy routes                        | SSG target                        | Deploy/content publish               | Canonical, versioned legal content                              | Never substitute invented policy text                       |

Cache keys must include every dimension that changes public output. Never put cookies, authorization, customer IDs, guest-cart tokens, addresses or order data into shared cache keys or payloads. On-demand invalidation accepts only allowlisted tags and authenticated provider webhooks.

## Current storefront constraint resolved

The storefront header must not read guest-cart cookies on the server for every route. That pattern turns otherwise public catalog and product pages dynamic and defeats the ISR/SSG strategy. The current implementation therefore hydrates cart state on the client from a same-origin endpoint, while `/cart`, `/checkout`, `/order-success`, `/order-tracking`, wishlist, and account routes remain private and dynamic.
