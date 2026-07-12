# Accessibility audit

**Status:** CURRENT PHASE AUDIT

## Scope

- Root layout and skip-link target
- Header actions and overlay entry points
- Checkout form semantics
- Search input semantics
- Cart and checkout route foundations

## Findings

| Severity | Finding                                                                                 | Status     |
| -------- | --------------------------------------------------------------------------------------- | ---------- |
| High     | Checkout form fields lacked meaningful autocomplete/type/input hints in several places. | Fixed      |
| Medium   | Root skip-link target benefited from explicit anchor offset handling.                   | Fixed      |
| Medium   | Search input lacked search-specific input hints.                                        | Fixed      |
| Medium   | Full journey-level keyboard and screen-reader verification is still manual work.        | Documented |

## Fixes

- Added autocomplete values for checkout name, phone, email, province, district, ward, and street-address fields.
- Added `type="tel"` and `inputMode="tel"` for phone input.
- Disabled spellcheck for email input.
- Added `enterKeyHint="search"` and `inputMode="search"` to the global search field.
- Added a skip-link destination offset class to the root target.

## Remaining risks

- Native `<dialog>` behavior still requires manual browser/screen-reader verification.
- Mobile autofocus behavior in the search overlay may still need device-specific tuning.
- Full PLP/PDP/cart/checkout keyboard and zoom journeys still need Playwright/manual coverage beyond unit tests.

## Verification method

- Source audit
- Existing unit tests plus new SEO/supporting tests
- Manual requirement trace against `docs/ACCESSIBILITY.md`

## Follow-up recommendations

- Re-run responsive and keyboard journeys in Playwright once local web-server binding is available.
- Add targeted a11y tests for checkout field semantics and search dialog interactions.
