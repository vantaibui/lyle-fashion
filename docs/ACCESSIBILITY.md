# Accessibility guidelines

## Account, tracking, and returns

- Account navigation is a named landmark with scrollable mobile reflow and 44px targets; content uses semantic headings, lists, sections, addresses, and ordered timelines.
- Forms use visible labels, autocomplete/input types, native controls, busy states, inline errors, polite status announcements, and destructive confirmation.
- Order statuses are text rather than color alone. Timelines expose incomplete steps to assistive technology.
- Tracking uses generic actionable errors and does not move focus unexpectedly. Return and address forms remain single-column at narrow widths and wrap long Vietnamese labels.
- Release checks still require VoiceOver/Safari, NVDA/Chrome, 200/400% zoom, reduced motion, forced colors, mobile keyboard, and all required viewport widths.

**Status: APPROVED FOUNDATION. Target conformance level requires formal product approval; components are designed toward WCAG 2.2 AA.**

## Baseline

- Prefer semantic HTML before ARIA.
- All functionality must work with keyboard and screen reader.
- Keep zoom enabled and support reflow at 320 CSS pixels.
- Normal text contrast targets at least 4.5:1; large text and essential UI boundaries target at least 3:1.
- Never communicate selection, stock, feedback or status through color alone.
- Respect reduced motion and do not use animation to block input.
- Touch targets are at least 44×44px.

## Focus

- Use `:focus-visible`; do not suppress outlines without the tokenized replacement.
- Dialog and Drawer use native `<dialog>` focus containment and Escape behavior, with explicit close controls.
- After form submission errors, consumers must focus the error summary or first invalid field.
- After route changes, page implementations must move focus to the main heading/content when needed.
- Do not create positive `tabIndex` ordering.

## Forms

- Every form control has a visible `<label>` or an explicit accessible name.
- Labels and checkbox/radio controls share one hit target.
- Use meaningful `name`, `type`, `inputMode` and `autoComplete` values at the consuming form.
- Errors are associated using `aria-describedby` and exposed with `role="alert"` or a polite live region.
- Error color is supplemented by text. Placeholder text is an example, not a label, and ends with an ellipsis character.
- Never prevent paste. Submit remains available until a request starts, then exposes loading and duplicate-submission protection.

## Selection controls

- ColorSwatch exposes the color name and selected state; visible swatch color is supplementary.
- SizeSelector uses a radio group, arrow-key navigation and skips unavailable options.
- Combobox follows input/combobox/listbox/option semantics, supports arrows, Enter and Escape, and exposes empty/error states.
- QuantitySelector is a named group with named increment/decrement buttons and a live output.
- Tabs use roving focus and arrow-key navigation.

## Overlays and feedback

- Dialog and Drawer expose title, close action, Escape handling, overscroll containment and safe mobile geometry.
- Tooltip content is reachable by hover and keyboard focus and must never contain required interactive content.
- Toast uses a polite live region and must not steal focus.
- Popover currently uses native disclosure semantics; use it only for non-modal supplemental content.
- Loading UI exposes `aria-busy`; decorative Skeleton elements are hidden from assistive technology.

## Images and content

- ProductImage requires `alt`; use `alt=""` only for truly decorative duplicate media.
- Image dimensions/aspect ratio are reserved through `next/image` and a sized wrapper.
- Product imagery must not embed essential variant or price text that lacks an HTML equivalent.
- Long Vietnamese content wraps; never truncate critical labels, prices, errors, sizes or status.
- Heading hierarchy belongs to the consuming page; shells do not force a page-level heading rank.

## Component-state expectations

| Component family | Required states                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Actions          | default, hover, focus-visible, active, disabled, loading, destructive where applicable       |
| Fields           | default, hover, focus-visible, disabled, invalid, helper, loading/read-only where applicable |
| Selection        | unselected, selected, unavailable/disabled, error, keyboard focus                            |
| Overlays         | closed/open, initial focus, Escape/close, long content, mobile, reduced motion               |
| Commerce shells  | loaded, loading, empty, error, unavailable and long localized content                        |

## Testing

- Storybook accessibility checks run in error mode.
- React Testing Library queries by role/name and verifies state semantics.
- Keyboard stories/tests cover focus, activation, arrows, Escape and roving patterns.
- Before release, add manual VoiceOver/Safari and NVDA/Chrome checks for composed journeys.
- Test 200% and 400% zoom, reduced motion, high-contrast/forced-colors where supported, and long Vietnamese content.

Known limitation: automated checks and primitive tests do not prove complete page conformance. Composed PLP/PDP/cart/checkout flows require journey-level audits.

## Header and search keyboard contract

- A visible-on-focus skip link targets `#main-content` before the navigation sequence.
- Desktop navigation uses button disclosure semantics rather than ARIA menu roles: Tab reaches each trigger/link, Left/Right moves between group triggers, Down Arrow enters the open panel, and Escape returns focus to its trigger.
- Mobile navigation uses the native modal Drawer foundation. Every hierarchy change has a named back action; closing returns focus to “Mở menu”.
- Search uses a labeled combobox controlling one listbox. Up/Down changes the active suggestion, Enter opens the active result or submits the normalized query, and Escape closes and restores the trigger.
- Search status is announced politely for loading, result count and failure. Empty/error states contain specific recovery guidance.
- Header icon actions have Vietnamese names, 44×44px targets, and count text in the accessible name when a real count exists.

Before release, manually verify the composed header with VoiceOver/Safari and NVDA/Chrome, focus containment in native dialogs, 200/400% zoom, forced colors and Vietnamese IME composition.

## Product listing contract

- PLPs expose one H1, a named breadcrumb navigation, a named product list and a polite result-count update.
- Filter groups use native disclosure, fieldset/legend and labeled checkboxes. Counts are descriptive text; unavailable options use native disabled semantics.
- Mobile Filter and Sort reuse Drawer focus containment, Escape behavior, scroll lock and focus restoration. Live URL updates must not discard the customer’s filter context.
- Active-filter removal is a named button (`Bỏ bộ lọc <group>: <value>`). Clear All is a separate action and result changes never depend on color.
- Product cards keep links and actions as siblings rather than nesting buttons inside links. Media and name links identify the same product; favorite, swatches and Quick Add have specific names.
- Swatches expose localized color names and pressed state. Stock status has text. Compare-at price is labeled and discount text appears only when both math and backend display permission are valid.
- Quick Add requires explicit size selection, exposes unavailable sizes as disabled, announces validation/API errors and blocks out-of-stock products.
- Numbered pagination uses a named nav, 44px links and `aria-current="page"`.

Manual release checks remain required for VoiceOver/NVDA product-card verbosity, filter Drawer focus after server navigation, zoom/reflow, forced colors and image error alternatives.

## Product detail contract

- PDP exposes one H1, a named breadcrumb navigation and one primary purchase region.
- Color selection is a labeled fieldset. Visible swatches are supplementary to the localized color name and selected state.
- Size selection is explicit. Unavailable sizes use native disabled semantics and remain discoverable as unavailable, not silently hidden.
- Bundle component size selection uses separate fieldsets per component. Validation errors must point to the affected component, not only a page-level summary.
- Mobile sticky purchase actions must not cover validation text, focused controls or system safe areas.
- Gallery interaction requires keyboard-reachable thumbnails/buttons, descriptive alt text for the active product image and non-essential duplicate imagery marked decorative where applicable.

## Cart and checkout contract

- Cart drawer and similar overlays use the shared dialog/drawer foundation: focus trap, Escape close, focus restoration, scroll lock, and safe-area padding.
- Cart line actions require named quantity controls, named remove and move-to-wishlist actions, and polite announcements for updates.
- Checkout keeps persistent visible labels, field-level errors, one page-level error summary, and a focus target after validation failure.
- Shipping and payment selections use keyboard-accessible radio controls with visible descriptions. Development-only payment methods must still announce their availability and mock status.
- Order submission and recovery messaging must announce busy/success/failure states without exposing private data in live regions.
