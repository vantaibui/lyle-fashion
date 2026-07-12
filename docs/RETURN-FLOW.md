# Return flow

**Status: DRAFT — reference foundation only.**

The current protected flow selects a delivered owned order, an owned line, quantity, a configuration-backed reason code, and an optional note. Server validation rejects missing lines, quantities above the purchased quantity, and non-delivered orders. A repeated development submission for the same order returns its existing request instead of creating a duplicate. The returned status begins at `REQUESTED`; status changes remain backend-owned.

No business return window, excluded category, hygiene/final-sale rule, damaged-item exception, exchange rule, refund method, or settlement time is approved. The UI therefore does not claim eligibility beyond the minimal delivered/owned/quantity checks and tells customers that the server remains authoritative.

Bundle partial returns, discount recalculation, promotion reversal, component restrictions, refund allocation, and cancellation are blocked. Safest MVP remains full-bundle return only after product, finance, and operations approve it. Evidence upload is not implemented because storage, malware scanning, MIME detection, limits, retention, and access control are missing.

Production needs a return eligibility endpoint, reason configuration, idempotent submission, return-line quantities, authorization, status events, refund linkage, customer-safe timelines, and support escalation. `/account/returns/[returnId]` remains absent until detail ownership and status contracts are approved.
