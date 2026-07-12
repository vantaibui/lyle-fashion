# Performance audit

**Status:** CURRENT PHASE AUDIT

## Scope

- Route rendering classification
- Header/search/cart client boundaries
- Image and font loading foundations
- Metadata/data-fetch duplication risks
- Build output and static/dynamic route behavior

## Findings

| Severity | Finding                                                                                            | Status             |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| Critical | The global header read cookies on the server, making public storefront routes dynamic.             | Fixed              |
| High     | Search overlay and cart drawer code was bundled into the always-present header path.               | Fixed              |
| Medium   | Header still performs a same-origin cart fetch after hydration on public pages.                    | Documented         |
| Medium   | No bundle-analyzer workflow is configured yet.                                                     | Documented         |
| Low      | Fonts currently rely on system stacks; payload is minimal but typography optimization is deferred. | Acceptable for now |

## Fixes

- Removed server-side cart cookie reads from the root header path.
- Moved header cart state hydration to the client so public routes can stay cacheable/static.
- Dynamically imported `SearchOverlay` and `CartDrawer` to reduce always-loaded header JS.
- Preserved server-owned cart authority for private flows.

## Remaining risks

- Product cards remain client components for wishlist and quick-add interactions, so PLP hydration cost still scales with product count.
- Header cart count now updates after hydration instead of being server-rendered.
- No real-user metrics or Lighthouse baseline is available in this environment.

## Verification method

- Source audit
- Next.js production build output
- Typecheck/lint/tests

## Follow-up recommendations

- Consider server-first or progressively enhanced product-card actions if PLP bundle size becomes a launch blocker.
- Add bundle analysis and field metrics after analytics and deployment tooling are approved.
- Re-run performance checks in a full environment with Lighthouse and network profiling.
