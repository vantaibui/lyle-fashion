# Customer account functional scope

**Status: DEVELOPMENT FOUNDATION; business policy remains DRAFT.**

## Delivered routes

- `/account`: protected overview with profile, default address, recent order, return summary, and navigation.
- `/account/profile`: name, phone, read-only email, separate optional marketing preferences, and account-deletion entry point.
- `/account/addresses`: protected list, add, delete, and one default-shipping constraint.
- `/account/orders` and `/account/orders/[orderId]`: protected paginated foundation and ownership-scoped detail.
- `/account/returns`: protected request and status foundation.
- `/wishlist`: versioned guest-device product references with corrupt-storage recovery.
- `/order-tracking`, `/login`, and `/forgot-password`: public-safe foundations.

Every private route is dynamic and every private API is no-store. Forms provide labels, native semantics, busy state, inline/live feedback, mobile reflow, long-text wrapping, and keyboard-operable controls. Account analytics vocabulary is typed, but no provider is connected and PII is excluded by contract.

## Deferred behavior

Address edit and billing addresses wait for approved backend need. Administrative division selectors wait for a maintained provider. Account deletion currently has an entry point only; submission requires retention and re-authentication policy. Authenticated wishlist persistence/merge, wishlist variant editing and move-to-cart remain disabled until authoritative product/wishlist/cart contracts exist.

Success, loading, empty, error, validation, mobile, accessibility, analytics, and private-caching expectations apply to every account module. Account routes are `noindex`; they have no positive SEO impact and must never enter sitemap output.
