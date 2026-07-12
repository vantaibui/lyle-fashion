# Order experience

**Status: DEVELOPMENT FOUNDATION; operational contracts are DRAFT.**

Order history keeps order, payment, and fulfillment statuses separate. It displays opaque public order codes, localized dates and VND totals, item count, primary item text, and a detail action. The page contract is paginated even though the development adapter has one seed order. Filters are deferred because status mapping is not approved.

Order detail is fetched only after authentication and server-side ownership validation. It shows customer-safe snapshots, independent statuses, a status-derived timeline, product lines, totals, payment method, and delivery snapshot. It excludes database IDs, fraud data, provider secrets, internal notes, and full payment details.

The timeline renders only transitions supported by the received order and fulfillment states. Cancellation and invoice actions are absent because policy and backend capability are unapproved. Bundle grouping, discounts, promotions, tax, tracking events, returns, and refunds require explicit historical snapshot fields; the UI must not reconstruct them from current catalog data.

Guest tracking requires order code plus matching phone or email, uses a generic failure response, limits attempts in the development process, returns only carrier/tracking/fulfillment data, and uses private no-store responses. Production requires distributed abuse controls, normalized timing, audited contact matching, carrier contracts, and support contact content.
