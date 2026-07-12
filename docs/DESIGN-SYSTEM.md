# LYLE Quiet Premium Design System

**Status: APPROVED FOUNDATION — product art direction and real commerce content still require design/content approval.**

## Direction

LYLE Quiet Premium is minimal, natural, editorial, warm-neutral, gender-neutral, accessible, mobile-first and product-image focused. Premium quality comes from typography, proportion, material color, fine rules and generous rhythm—not ornamental effects.

Avoid dashboard density, glassmorphism, gradients, heavy elevation, nested rounded cards, excessive pills, decorative motion and generic luxury defaults. The signature is a restrained “material margin”: image-led layouts with warm bone space, ink typography and flax rules that echo woven fibers.

## Source of truth

`src/design-system/tokens/theme.css` owns every token as CSS custom properties. Tailwind 4 maps semantic variables through `@theme inline`. Components consume semantic utilities or variables and must not repeat palette hex values.

Token layers:

1. `--palette-*`: raw, centralized color values.
2. `--semantic-*`: purpose-based color decisions.
3. Tailwind `--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--shadow-*` and breakpoint mappings.

## Color

Brand anchors are Ink, Bone, Flax, Moss and Clay. Semantic roles cover background, surface, muted/inverse surface, text levels, border levels, action states, focus, success, warning, danger, info, scrim and skeleton states.

- Ink/Bone create the primary high-contrast editorial relationship.
- Flax is a quiet material accent and selection surface, not a universal CTA color.
- Moss and Clay support natural brand expression and controlled merchandising accents.
- Blue focus is intentionally distinct from brand/feedback colors so keyboard focus remains recognizable.
- Feedback always includes text or semantics; color never carries meaning alone.

## Typography

- **Display direction:** Noto Serif, falling back through DejaVu Serif, Georgia and Times New Roman. Use for editorial headings, never dense controls.
- **UI/body direction:** Be Vietnam Pro or Noto Sans when locally available, then the platform system UI stack. The fallbacks retain Vietnamese readability without a build-time network dependency.
- **Asset status:** font files are not yet vendored. Add approved WOFF2 assets through `next/font/local` after licensing and brand approval; do not restore build-time Google Fonts fetching.
- **Scale:** 2xs through xl are fixed; 2xl through display use bounded `clamp()` values.
- **Body:** 16px minimum, 1.55 line height. Long reading copy may use 1.7.
- **Prices/data:** tabular numerals through `font-variant-numeric` utilities.
- **Editorial headings:** balanced wrapping and tight, restrained tracking.

Do not use display serif for form labels, helper text, prices or status messages.

## Layout

- Maximum content width: `90rem`.
- Reading width: `44rem`.
- Narrow/form width: `32rem`.
- Gutters: `1rem` mobile, `2rem` tablet, `3rem` desktop.
- Grid: 12 columns with `1rem` mobile and `1.5rem` desktop gaps.
- Section rhythm: responsive `3.5rem–8rem`.
- Product grid: compact horizontal relationship and generous vertical editorial spacing.
- Full-height overlays use dynamic viewport units and safe-area insets.

Use `Container`, `Section`, `Stack` and `Grid` instead of repeating layout constants.

## Shape and elevation

Default radii are 2–8px. Full radius is reserved for intrinsically circular controls such as swatches and icon buttons. Cards are not automatically rounded or elevated. Use borders and spacing first; `shadow-overlay` is reserved for floating overlays and `shadow-subtle` for small physical separation.

## Motion

- Fast: 120ms.
- Normal: 200ms.
- Slow: 320ms.
- Standard easing: `cubic-bezier(0.2, 0, 0, 1)`.
- Animate only opacity and transform where motion is required; color/border transitions may use explicit properties.
- Never use `transition: all` or motion that changes layout geometry.
- `prefers-reduced-motion: reduce` collapses animation/transition duration globally.

## Focus and touch

- Focus ring: 2px blue with a 3px offset.
- Minimum interactive target: 44×44px.
- Icon buttons require a non-empty `label` prop, producing an accessible name.
- Adjacent compact targets keep at least an 8px gap unless grouped controls provide distinct boundaries.

## Component tiers

- `src/components/ui`: domain-neutral primitives.
- `src/components/layout`: shared responsive composition.
- `src/components/commerce`: commerce-aware presentation foundations only.
- `src/design-system`: tokens, global foundations and system documentation/stories.

Interactive primitives use the smallest `'use client'` boundary. Static layout, price, badge, image and shell components remain Server Component-compatible.

## Implemented components

UI: Button, IconButton, Link, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, FormField, FormMessage, Price, Badge, ProductBadge, ColorSwatch, SizeSelector, QuantitySelector, Accordion, Dialog, Drawer, Popover, Tooltip, Toast, Skeleton, Breadcrumb, Pagination, Tabs, Separator and VisuallyHidden.

Layout: Container, Section, Stack and Grid.

Commerce: ProductImage, ProductPrice, ProductBadgeGroup, ProductColorSelector, ProductSizeSelector, ProductQuantity, ProductCardShell, ProductGridShell, EmptyState, ErrorState and LoadingState.

These are foundations, not final PLP, PDP, cart or checkout behavior. Commerce values must come from server-validated data.

## Review checklist

- Uses semantic tokens; no component palette hex values.
- Handles default, hover/focus, disabled, loading and error states where applicable.
- Handles long Vietnamese labels without losing meaning.
- Works at 375px without horizontal page scrolling.
- Preserves keyboard operation, focus order and screen-reader names/states.
- Reserves image geometry and avoids CLS-causing motion.
- Has Storybook coverage and focused behavioral tests before promotion to stable.
