# SEO audit

**Status:** CURRENT PHASE AUDIT

## Scope

- Root metadata and layout defaults
- Catalog metadata and canonicals
- PDP metadata and structured data
- Robots and sitemap behavior
- Private-route indexing controls
- Placeholder editorial/account/storefront routes

## Findings

| Severity | Finding                                                                                                       | Status                 |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| High     | Public indexing had no explicit environment gate beyond route defaults.                                       | Fixed                  |
| High     | Sitemap strategy existed only as an empty stub with no scalable coverage path.                                | Fixed                  |
| High     | Global structured data lacked Organization/WebSite foundations.                                               | Fixed                  |
| High     | PDP structured data under-described visible product facts.                                                    | Fixed                  |
| Medium   | Social sharing image foundation was missing.                                                                  | Fixed                  |
| Medium   | Trailing-slash canonical normalization was not explicit.                                                      | Fixed                  |
| Medium   | SearchAction is not yet truthful because search results are still placeholder-grade.                          | Deferred intentionally |
| Medium   | Placeholder editorial/store pages should remain excluded from sitemap and indexing until real content exists. | Confirmed              |

## Fixes

- Added `NEXT_PUBLIC_ENABLE_INDEXING` gating and preview-host protection for metadata, robots, and sitemap behavior.
- Added canonical URL normalization for trailing slashes.
- Added global Organization and WebSite JSON-LD in the root layout.
- Added app-level Open Graph and Twitter image routes.
- Added truthful PDP schema with brand, URL, and VND Offer data derived from visible product state.
- Added gated sitemap coverage for catalog, collections, and products only.

## Remaining risks

- Launch indexing is still disabled by design.
- Search results, journal content, lookbook content, and stores are not ready for indexable structured data or sitemap inclusion.
- Redirect ownership for future slug changes is still unresolved.

## Verification method

- Source audit
- Unit tests for canonical helpers, indexing policy, sitemap gating, and product schema
- Production build route classification

## Follow-up recommendations

- Approve production hostname and indexing launch checklist before enabling indexing.
- Add article/store structured data only when CMS/store records are real and visible.
- Add redirect maps and 410 policy only when content lifecycle rules are approved.
