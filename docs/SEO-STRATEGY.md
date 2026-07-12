# SEO strategy

**Status: DRAFT — indexing and route taxonomy require approval.**

Global and route metadata, absolute canonicals, Open Graph defaults, robots exclusions, an empty sitemap and safe JSON-LD serialization now exist. Indexing remains disabled until the production hostname, Vietnamese locale/URL policy, route taxonomy, content ownership and launch approval are confirmed.

`NEXT_PUBLIC_ENABLE_INDEXING` is the current release gate. Public route metadata, robots, and sitemap generation stay non-indexable until that flag is explicitly enabled and the site origin is not localhost or a preview host such as `.vercel.app`.

## Route rules

- Product, category, collection, journal, lookbook, material and approved store content must render discovery-critical content on the server.
- Search, wishlist, cart, checkout, confirmation, tracking and account routes are always non-indexable and excluded from sitemaps. Robots disallow is defense-in-depth, not access control.
- Arbitrary filters, sort orders, campaign parameters and internal search results never create indexable canonicals. Pagination/canonical policy is unresolved.
- Slugs are validated URL identifiers, not trusted content. Missing, invalid or unpublished canonical entities return 404; approved slug changes require permanent redirect ownership.

## Metadata and structured data

Route metadata uses one canonical helper and Vietnamese Open Graph locale. Social image assets/templates are intentionally absent until brand assets and content ownership are approved.

Breadcrumb, Product, Organization and Article JSON-LD types are foundations only. Render them only from visible, server-validated data. Do not fabricate reviews, ratings, offers, availability, authors, stores or organization facts. Serialize with `serializeJsonLd`; never interpolate raw JSON into a script string.

Sitemaps remain empty until canonical, published records are available. The future generator must include only absolute canonical URLs, split before platform limits, use authoritative modification dates and exclude private/filtered/preview routes.

The current foundation now supports catalog-, collection-, and product-sitemap entries behind the indexing gate. Placeholder, private, internal-search, checkout, account, payment, and draft/editorial routes remain excluded.

## Launch prerequisites

Approve production origin, locale/alternate-language plan, taxonomy, canonicals, pagination/facets, redirects, CMS publishing, product-offer schema ownership, sitemap sources, preview/staging protection, social assets and automated crawl/schema checks.

## PLP indexing and pagination

The implemented PLP routes have unique server-rendered H1, title, description, canonical and BreadcrumbList data. Global launch indexing is still disabled.

The chosen pagination strategy is crawlable numbered pagination. An unfiltered `page>1` URL canonicalizes to itself and includes a page suffix in the title. Page links are ordinary anchors and remain usable without client JavaScript.

Any gender/category/collection/material/style/color/size/availability/price-tier/promotion/query/variant or non-default sort state is non-indexable and canonicalizes to the durable landing URL. This prevents arbitrary facet combinations from becoming crawl surfaces. Fixed `/men`, `/women` and `/collections/[slug]` route context is part of the landing identity, not a query filter.

Empty filtered pages remain useful to customers but non-indexable. Missing or invalid collection slugs return 404. Only approved, published collection slugs may enter static parameters or future sitemaps.

## PDP canonical and variant-query policy

- `/product/[slug]` is the only canonical PDP URL. Optional variant query state such as `?color=ink&size=m` is shareable for customer continuity but canonicalizes back to `/product/[slug]`.
- Variant query URLs remain non-indexable even after launch indexing is approved globally. They represent selection state, not distinct crawl surfaces.
- Invalid or stale variant query values must not create alternate canonicals, soft-404 content or contradictory schema. The page falls back to a safe product state and may surface a customer-facing validation notice.
- PDP JSON-LD must reflect only server-visible content. If the route does not have a valid selected SKU, omit SKU-specific structured data rather than fabricating one.
