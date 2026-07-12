# Performance budget

**Status:** APPROVED FOUNDATION BUDGETS — tune with production RUM once real integrations exist.

## Scope

These budgets apply to the current storefront foundation, especially `/shop`, `/men`, `/women`, `/collections/[slug]`, and `/product/[slug]`.

## Budgets

| Budget item               | Target                        | Notes                                                                     |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| Public-route initial JS   | <= 170 KB gzip                | Includes header, listing or PDP interactivity only.                       |
| Per-route incremental JS  | <= 60 KB gzip                 | Additional route-specific JS after shared chunks.                         |
| Cart/checkout route JS    | <= 220 KB gzip                | Private commerce flows may exceed catalog routes but should stay bounded. |
| Critical CSS              | <= 35 KB gzip                 | Avoid route-specific CSS duplication.                                     |
| LCP image payload         | <= 220 KB compressed          | One hero or primary PDP image only.                                       |
| Product thumbnail payload | <= 80 KB compressed           | 4:5 product grid image target.                                            |
| Gallery image payload     | <= 180 KB compressed          | Non-LCP gallery images lazy load.                                         |
| Total font transfer       | <= 120 KB compressed          | Current system fonts effectively cost 0 KB network.                       |
| Third-party script budget | 0 KB blocking, <= 50 KB async | No approved third-party scripts should block first paint.                 |
| LCP                       | <= 2.5 s                      | Local production proxy only until real-user data exists.                  |
| INP                       | <= 200 ms                     | Focus on header, search, PLP controls, PDP selectors, cart, checkout.     |
| CLS                       | <= 0.1                        | Reserve image/media and sticky-action geometry.                           |
| TTFB                      | <= 800 ms                     | Public cached routes. Private routes measured separately.                 |

## Current measurement constraints

- No real-user monitoring is approved yet, so no RUM claims are made.
- Lighthouse, bundle analyzer, and e2e-driven perf checks are environment-dependent and may be unavailable in the current sandbox.
- Next.js build output and route classification are the current stable verification sources.

## Follow-up

- Add automated bundle analysis once a non-network-dependent analyzer workflow is approved.
- Replace placeholder content and in-memory cart foundations before enforcing final production budgets.
- Add field data targets once analytics/consent/RUM tooling is approved.
