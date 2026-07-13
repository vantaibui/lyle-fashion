# Elise.vn homepage redesign (academic demo)

**Status: ACADEMIC DEMO — NOT PRODUCTION.** This document records a course/school
exercise that restyles the storefront homepage to visually resemble
[elise.vn](https://elise.vn). It is not an approved product direction, is not for
commercial use or public deployment, and intentionally departs from the approved
`DESIGN-SYSTEM.md` ("LYLE Quiet Premium") direction. Real product art direction,
brand, and commerce content still require design/content approval before any launch.

## Intent and decisions

- **Fidelity:** full pixel-match to elise.vn's live homepage. This overrides the
  approved Quiet Premium visual direction for demo purposes only.
- **Token-driven, not ad hoc:** the elise look is applied by retargeting the token
  layer in `src/design-system/tokens/theme.css`. Components consume semantic
  utilities/variables; no palette hex is hard-coded in components. The structural
  rules in `AGENTS.md` / `FE-PROJECT-RULES.md` (RSC-first, named exports, no barrels,
  no commerce data in JSX) are preserved.
- **Imagery:** real elise.vn images were downloaded locally into `public/elise/**`.
  The CSP (`next.config.ts`, `img-src 'self' data: blob:`) was **not** weakened and
  no `images.remotePatterns` were added — hotlinking is intentionally avoided.
- **Reference source:** elise.vn screenshots were unavailable, so the live site was
  fetched (WebFetch + curl) as the reference target.

## Detected elise reference tokens

| Role              | Value                                   |
| ----------------- | --------------------------------------- |
| Brand accent gold | `#a68242`                               |
| Sale / discount   | `#f96c6c` (coral)                       |
| Body text         | `#666666`                               |
| Background        | `#ffffff`                               |
| Font              | Helvetica Neue (sans; no display serif) |
| Body line-height  | 1.75                                    |

## Token changes (`src/design-system/tokens/theme.css`)

- Palette retargeted to elise: ink `#2b2b2b`, bone `#ffffff`, flax/moss → gold
  `#a68242`, new `--palette-brand-sale: #f96c6c`, neutral grays realigned.
- New semantic tokens: `--semantic-sale`, `--semantic-sale-surface`,
  `--semantic-text-strong`; wired through `@theme inline` as `--color-sale`,
  `--color-sale-surface`, `--color-text-strong`, `--color-brand-sale`.
- `--font-family-display/body/ui` → Helvetica Neue sans stack.
- `--line-height-normal` → 1.75 (matches elise body rhythm).

## New marketing module (`src/modules/marketing/`)

| File                               | Role                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `home-content.ts`                  | Presentational demo data (hero, promos, products, snap, ranking). Never cart/price authority. |
| `components/hero-carousel.tsx`     | Client carousel; responsive desktop/mobile crops; reduced-motion aware.                       |
| `components/sale-product-card.tsx` | Composes existing `ProductCardShell`/`ProductImage`/`Price`; coral SALE badge + strike price. |
| `components/new-arrival-grid.tsx`  | "New Arrival" grid.                                                                           |
| `components/promo-tiles.tsx`       | Category/promo tiles.                                                                         |
| `components/snap-gallery.tsx`      | Staff styling gallery.                                                                        |
| `components/employee-ranking.tsx`  | Ranked staff list.                                                                            |
| `components/section-heading.tsx`   | Shared section heading.                                                                       |
| `components/home-page-content.tsx` | Composes all homepage sections.                                                               |

## Other files touched

- `src/app/(storefront)/page.tsx` — renders `HomePageContent` (was `RoutePlaceholder`).
- `src/components/layout/header/header-interactive.tsx` — coral "SALE 50%" nav link.
- `src/components/layout/footer/` (new) — `storefront-footer.tsx` + `footer-content.ts`;
  rendered in `src/components/layout/public-site-chrome.tsx`.
- `src/design-system/foundations/base.css` — `::selection` contrast fix for gold.

**Brand identity stays LYLE.** Only the elise _visual language_ (layout, palette, type)
is adopted. The header/footer wordmark, company name, and copyright read LYLE; social
links are neutral placeholders; elise's real government-registration (bocongthuong)
badge is intentionally omitted rather than shown under the LYLE name.

## Image assets (`public/elise/`)

Downloaded from elise.vn (~4.7 MB): `banners/` (desktop `cv-*`, mobile `mb-*`),
`products/` (product-01…12 plus a 2nd angle `-NNb` each = 24 files), `footer/`
(trust + app badges), `brand/` (logo, bocongthuong cert, social icons).

## Product imagery across all pages

All product photos flow from two mock adapters, so fixing the source fixes every
downstream page:

- `src/modules/catalog/api/elise-demo-images.ts` (new) — single source of truth
  mapping product index → real elise photo pair (`primary` + `alternate`).
- `mock-catalog-adapter.ts` — PLP cards, card hover, and colour swatches now use
  real elise photos.
- `mock-product-adapter.ts` — PDP gallery shows the product's **2 real elise
  angles**; bundle-component images use each component's real photo. Cart,
  order-success, and account order thumbnails inherit `sku.images[0]`
  automatically.
- `account-store.ts` — demo order thumbnail repointed from the missing
  `/images/product-placeholder.svg` to a real elise photo.

Wishlist and search results intentionally left unchanged (they render no product
image; adding one would require prop/architecture changes). The old
`public/images/catalog/*.svg` placeholders remain only because a unit-test fixture
still references that path; nothing in the running app uses them.

## Verification

`pnpm validate` (format + lint + typecheck + 115 unit tests) and `pnpm build`
both pass; homepage prerenders static; images serve 200; elise tokens
(`a68242`, `f96c6c`, Helvetica Neue) compile into the shipped CSS; verified via
rendered screenshot.

## End-to-end demo flow

The browse → product → cart → checkout journey is functional against the repo's
existing mock adapters (`mockCatalogAdapter`, `mockProductAdapter`, in-process cart
store). Verified in a headless browser: PLP `/shop` renders products → PDP size
selection → add-to-cart increments the cart → `/cart` and `/checkout` render →
placing an order returns `POST /api/checkout` `201` and redirects to
`/order-success?order=…`. These pages inherit the elise palette automatically via
the shared tokens; their layout was not restyled section-by-section.

## Out of scope / not done

- Editorial/legal routes (`/lookbook`, `/journal`, `/stores`, `/search`, policy
  pages) still use their existing placeholders.
- No real commerce backend / payment / address providers — the flow runs on the
  in-repo mock adapters only; `mock_vnpay` is not a production success signal.
- Section-by-section elise restyle of PLP/PDP/cart/checkout was not done (they only
  inherit the global token palette).
- Storybook stories and behavioral tests for the new marketing components were not
  added (foundations-only demo). Add before any promotion to stable.
