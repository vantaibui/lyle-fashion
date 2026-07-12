# Responsive guidelines

**Status: APPROVED FOUNDATION.**

## Mobile-first contract

Start at 375px, verify down to 320px reflow, then enhance at tokenized breakpoints:

| Token | Width          | Intent                                                   |
| ----- | -------------- | -------------------------------------------------------- |
| `sm`  | 30rem / 480px  | Larger phones and compact two-column opportunities       |
| `md`  | 48rem / 768px  | Tablet gutters and composed layouts                      |
| `lg`  | 64rem / 1024px | Desktop navigation/content structure                     |
| `xl`  | 80rem / 1280px | Wider editorial/product grids                            |
| `2xl` | 96rem / 1536px | Large viewport cap; content still respects 90rem maximum |

Do not introduce component-local breakpoints when an existing token expresses the need.

## Containers and grid

- `Container` owns max width and responsive gutters.
- `Grid columns={12}` provides the editorial 12-column foundation.
- ProductGridShell defaults to 2 columns on compact screens and 4 at desktop, with an explicit 2/3/4-column option.
- Product cards use image ratio rather than JavaScript measurement.
- Reading content remains within 44rem; form/narrow content within 32rem.

## Product and commerce behavior

- Product imagery is primary; reserve aspect ratio before load to prevent CLS.
- At mobile widths, keep color/size selections wrapping and visible rather than horizontally clipping.
- Bundle/component choices must stack with a clear selected summary; no information should depend on hover.
- Sticky actions must account for safe-area insets and must not obscure validation or content.
- Commerce tables/timelines become labeled vertical groups rather than horizontal overflow when meaning can be preserved.

## Safe areas and viewport

- Use `100dvh`/`min-height: 100dvh` for viewport-filling overlays.
- Apply `env(safe-area-inset-top/bottom)` to edge-attached Drawer content and future sticky commerce actions.
- Use `overscroll-behavior: contain` inside modal scrolling surfaces.
- Fix the overflowing element; do not hide page overflow as a blanket workaround.

## Typography and localization

- Responsive heading tokens use bounded `clamp()` scales.
- Body/input text remains at least 16px on mobile.
- Allow Vietnamese words, diacritics and long operational messages to wrap naturally.
- Reserve truncation for repeated non-critical metadata with an accessible full-value path.

## Required view checks

- 320px reflow and 375px primary mobile.
- 768px tablet portrait and landscape.
- 1024px compact desktop/tablet landscape.
- 1280px and 1440px desktop.
- Mobile browser keyboard open, safe-area device, 200% zoom and long Vietnamese content.

No final PLP/PDP breakpoint behavior is approved in this phase; shells provide the composition primitives only.

## Global header and search

- The compact header is used below `xl` (1280px); this avoids compressing four navigation groups and four action targets at 1024px. Desktop mega navigation begins at `xl`.
- Compact header keeps wordmark, menu, search and cart visible. Account, wishlist and stores remain available through the nested menu where applicable.
- Desktop panels cap at 70rem and retain at least 2rem viewport clearance. They overlay content without changing document geometry.
- Mobile Drawer width is `min(26rem, 100% - 2rem)` and uses top/bottom safe-area insets. Only one navigation level is rendered as the active screen.
- Search dialog is `min(70rem, 100% - 2rem)`, uses dynamic viewport height and becomes a single-column suggestion layout below `md`.
- Automated checks cover 320, 375, 390, 768, 1024, 1280 and 1440px for overflow. Manual checks still cover mobile keyboard, landscape, safe areas, 200% zoom and long CMS labels.

## Product listing pages

- Product grid uses 2 columns on phones, 3 from `md`, and 4 from `xl`. The 4:5 media box reserves layout before images load.
- At `lg`, filters move into a 15rem sticky sidebar with an independently bounded viewport scroll area. The sidebar never overlaps the non-sticky global header.
- Below `lg`, result count, Filter and Sort controls form a compact toolbar. Filters and sorting use separate native modal Drawers with safe-area padding, scroll lock and explicit close/apply actions.
- Mobile filtering is live: selecting an option updates the URL and server result immediately while the Drawer remains the interaction context when React preserves it. “Xem n sản phẩm” explicitly closes it. Changing a filter or sort resets page to 1.
- Active filters wrap below the toolbar. Visible chip text may truncate within 14rem, while `title` and the accessible removal label preserve the complete value.
- Quick Add remains in flow on mobile. At desktop it occupies stable space but becomes visually prominent on card hover/focus, preventing card-height movement.
- Verify card readability at 320px, Drawer content with long Vietnamese labels, 200% zoom, reduced motion and keyboard focus that reveals Quick Add.

## Product detail pages

- PDP uses a single-column flow on compact widths, then expands to an image-led two-column layout from desktop sizes with the purchase summary pinned only when viewport height allows it.
- Mobile gallery uses horizontal swipe/scroll-snap behavior with visible progress feedback. Desktop uses one large active image with secondary thumbnail navigation.
- Sticky mobile purchase actions summarize price and state in one row and reserve bottom safe-area space. They must not hide the size selector, bundle-component errors or toast feedback.
- Bundle components stack vertically on mobile and may split into media + content subgrids only when both remain legible without horizontal scrolling.

## Cart and checkout pages

- Cart drawer remains readable at 320px without horizontal overflow and keeps line media, quantity controls, and summary content stacked rather than clipped.
- Cart page stays single-column on compact widths and moves the summary to a right rail only at desktop sizes.
- Checkout keeps the form single-column on phones. Province/district/ward selectors must remain usable with the mobile keyboard open and with long Vietnamese labels.
- Sticky checkout actions must leave room for safe-area insets and must not cover field errors, the page-level error summary, or lower form controls.
