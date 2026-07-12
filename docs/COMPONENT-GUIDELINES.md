# Component guidelines

**Status: APPROVED FOUNDATION.**

## Ownership

- Domain-neutral primitives: `src/components/ui`.
- Shared composition: `src/components/layout`.
- Commerce-aware presentation: `src/components/commerce`.
- Business state/orchestration: owning `src/modules/*` capability.

Do not create a second Button, field, selector or state shell to avoid learning an existing API. Extend the owning primitive when the behavior is truly shared. Avoid barrel exports; import the exact file.

## Server and client boundaries

Components remain Server Component-compatible unless they own browser events, effects or local interaction state. Current client boundaries are Combobox, ColorSwatch, SizeSelector, QuantitySelector, Tabs, Dialog, Drawer, Tooltip and their thin commerce selectors.

Do not pass non-serializable values from Server Components into client boundaries. Page/module composition owns server data fetching and converts it to plain serializable props.

## API rules

- Use named exports.
- Extend native element props where semantics remain intact.
- Use `isLoading`/`isInvalid` for transient component state and native `disabled` for disabled behavior.
- Require accessible labels in the type system where omission is unsafe, especially IconButton.
- Keep commerce monetary/availability authority outside components; ProductPrice only renders received values.
- No raw product/category/price fixtures outside stories/tests.
- Class overrides are escape hatches, not a replacement for semantic variants.

## State contract

- **Default:** clear purpose and stable geometry.
- **Hover:** increased contrast, never the only affordance.
- **Focus-visible:** tokenized ring with sufficient contrast.
- **Active:** immediate feedback without layout shift.
- **Disabled:** native semantics, reduced emphasis, no activation.
- **Loading:** `aria-busy`, stable label/geometry and duplicate-action prevention.
- **Error:** associated recovery text, alert semantics where timely, no color-only signal.
- **Empty:** explains absence and offers a valid next step.

Static structural components do not invent artificial loading/error props. Their composed owner uses LoadingState, ErrorState or the relevant field/action state.

## Styling rules

- CSS variables in `theme.css` are the source of truth.
- Use Tailwind semantic names such as `bg-surface`, `text-text-muted`, `border-border`, `font-display`.
- Do not repeat raw hex values inside components.
- Avoid `transition-all`, heavy shadows, large default radii, gratuitous gradients and pill-shaped generic controls.
- Motion uses explicit properties and tokenized durations/easing; reduced motion must remain functional.

## Composition rules

- Button communicates an action; Link communicates navigation.
- FormField supplies visible label/description; FormMessage supplies help/error/success semantics.
- ProductCardShell and ProductGridShell provide slots/geometry, not final PLP behavior.
- Product selectors accept backend-approved options but do not determine SKU availability themselves.
- Dialog is modal; Drawer is edge-attached modal; Popover is supplemental disclosure; Tooltip is non-interactive help.
- Empty/Error/Loading states must use specific, recoverable Vietnamese copy supplied by the consuming module.

## Story and test expectations

Every stable family needs representative default, hover/focus, disabled, loading/error, mobile/desktop, long Vietnamese, keyboard and reduced-motion coverage as applicable. Story fixtures are clearly non-production and must not become business constants.

Behavioral tests prioritize accessible role/name, keyboard paths, disabled/loading protection, state announcement and bounds. Visual regression can be added when CI/provider ownership is approved.

Font files are intentionally not bundled in this phase. Components consume semantic font variables so approved local WOFF2 assets can replace the current Vietnamese-capable system stacks without component changes.

## Global storefront header

`StorefrontHeader` remains a Server Component and owns the semantic header, skip link, announcement and brand mark. One `HeaderInteractive` client boundary receives the validated navigation payload once and composes desktop navigation, mobile navigation, search and account-intent actions. Counts are optional integration props and are never fabricated.

Navigation content lives in `src/config/navigation.ts`, outside visual components. Its Zod schema supports localized labels, internal destinations and an optional campaign image/link for a future CMS adapter. Desktop and mobile render the same parsed groups.

Desktop mega-menu triggers are native buttons with `aria-expanded`/`aria-controls`. Enter/Space or click toggles; Down Arrow opens and moves to the first destination; Left/Right moves across group triggers; Escape closes and restores focus. Pointer exit uses a short close delay so movement into the panel is safe; outside pointer interaction closes it.

The mobile Drawer shows one hierarchy level at a time. Group buttons move forward, “Menu chính” moves back, and Drawer supplies modal focus containment, scroll locking, Escape and an explicit close action. Header layout is intentionally non-sticky until product/design approves sticky behavior.

Search is owned by `src/modules/search`: the overlay handles interaction, the hook handles debounce/cancellation/race protection, contracts and schemas own trust boundaries, and adapters own data. Presentational components never contain suggestion fixtures.
