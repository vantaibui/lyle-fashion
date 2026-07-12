# Status transitions

## Phase 11 rendering note

The order experience renders `orderStatus`, `paymentStatus`, `fulfillmentStatus`, `returnStatus`, and `refundStatus` independently. The development timeline uses only explicit order/fulfillment values and never mutates status. Return requests enter `REQUESTED`; all later transitions remain backend-owned. The local order contract is narrower than this proposed model and must be reconciled before production, not collapsed into one display status.

**Status: DRAFT — proposed state machines, not approved operational policy.**

Order, payment, fulfillment, return, and refund status must remain independent. A single combined status loses information and creates invalid transitions. Backend services own transitions; the storefront renders server state and available actions.

## General transition rules

- Persist transition time, actor/system, reason code, correlation ID, and safe audit metadata.
- Reject illegal or stale transitions; do not silently coerce them.
- Make webhook and retry processing idempotent and order-tolerant.
- Present customer-friendly labels separately from stable machine values.
- Do not infer one state solely from another. Use explicit orchestration rules.

## `orderStatus`

Proposed values:

```text
DRAFT → PENDING_CONFIRMATION → CONFIRMED → COMPLETED
                    └──────────→ CANCELLED
PENDING_CONFIRMATION ──────────→ CANCELLED
```

| From                   | To                     | Proposed guard                                                                     |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| `DRAFT`                | `PENDING_CONFIRMATION` | Server-valid checkout and durable order creation request.                          |
| `PENDING_CONFIRMATION` | `CONFIRMED`            | Payment/COD and operator rules allow acceptance; inventory outcome is valid.       |
| `PENDING_CONFIRMATION` | `CANCELLED`            | Payment failure/expiry or operator/customer cancellation policy permits.           |
| `CONFIRMED`            | `COMPLETED`            | Required fulfillment is complete and closure policy is satisfied.                  |
| `CONFIRMED`            | `CANCELLED`            | Only if cancellation policy permits and fulfillment/payment compensation succeeds. |

Open: whether `ON_HOLD`, `PARTIALLY_CANCELLED`, or fraud-review states are needed; who may cancel; and when an order becomes completed.

## `paymentStatus`

Proposed values:

```text
NOT_REQUIRED
PENDING → AUTHORIZED → CAPTURED
   ├────→ FAILED
   └────→ EXPIRED
AUTHORIZED → VOIDED
CAPTURED → PARTIALLY_REFUNDED → REFUNDED
CAPTURED ─────────────────────→ REFUNDED
```

| From                               | To                   | Proposed guard                                                          |
| ---------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `PENDING`                          | `AUTHORIZED`         | Verified provider event; authorization model applies.                   |
| `PENDING`                          | `CAPTURED`           | Verified provider event for immediate-capture flow.                     |
| `PENDING`                          | `FAILED`             | Definitive provider failure.                                            |
| `PENDING`                          | `EXPIRED`            | Provider/session timeout reached.                                       |
| `AUTHORIZED`                       | `CAPTURED`           | Valid capture request within provider rules.                            |
| `AUTHORIZED`                       | `VOIDED`             | Authorization released before capture.                                  |
| `CAPTURED`                         | `PARTIALLY_REFUNDED` | Successful refund total is greater than zero and below captured amount. |
| `CAPTURED` or `PARTIALLY_REFUNDED` | `REFUNDED`           | Successful cumulative refunds equal captured amount.                    |

COD requires an approved interpretation: `PENDING` until collection, `NOT_REQUIRED` with a separate collection status, or another explicit model. Do not decide in frontend code.

Current local foundation keeps COD and the development-only online-payment mock in `PENDING` or `REQUIRES_ACTION` only to demonstrate separate payment surfaces. This is not approved operational policy.

## `fulfillmentStatus`

Proposed values:

```text
UNFULFILLED → PROCESSING → SHIPPED → DELIVERED
      └─────→ PARTIALLY_FULFILLED → SHIPPED/DELIVERED
PROCESSING or SHIPPED → DELIVERY_FAILED
PROCESSING or SHIPPED → RETURN_TO_SENDER
```

| From                                  | To                    | Proposed guard                                                          |
| ------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| `UNFULFILLED`                         | `PROCESSING`          | Warehouse accepts work.                                                 |
| `PROCESSING`                          | `PARTIALLY_FULFILLED` | Some quantities are dispatched under an approved split-shipment policy. |
| `PROCESSING` or `PARTIALLY_FULFILLED` | `SHIPPED`             | Carrier has accepted all required shipment quantities.                  |
| `SHIPPED`                             | `DELIVERED`           | Trusted carrier/operator delivery event.                                |
| `PROCESSING` or `SHIPPED`             | `DELIVERY_FAILED`     | Carrier reports an actionable failed delivery.                          |
| `SHIPPED` or `DELIVERY_FAILED`        | `RETURN_TO_SENDER`    | Carrier confirms return flow.                                           |

Open: split shipments, pickup, retry delivery, lost/damaged handling, and whether status is aggregated from Shipment records.

## `returnStatus`

Proposed values:

```text
REQUESTED → UNDER_REVIEW → APPROVED → IN_TRANSIT → RECEIVED → INSPECTED → COMPLETED
        └───────────────→ REJECTED
REQUESTED/APPROVED ─────→ CANCELLED
```

| From           | To             | Proposed guard                                      |
| -------------- | -------------- | --------------------------------------------------- |
| `REQUESTED`    | `UNDER_REVIEW` | Required request data is complete.                  |
| `UNDER_REVIEW` | `APPROVED`     | Return policy and item eligibility pass.            |
| `UNDER_REVIEW` | `REJECTED`     | Documented policy reason and support path provided. |
| `APPROVED`     | `IN_TRANSIT`   | Return handoff/tracking begins.                     |
| `IN_TRANSIT`   | `RECEIVED`     | Warehouse receives package.                         |
| `RECEIVED`     | `INSPECTED`    | Item-level inspection is recorded.                  |
| `INSPECTED`    | `COMPLETED`    | Required refund/exchange/closure action succeeds.   |

Open: eligibility window, hygiene/final-sale rules, bundle component returns, exchanges, shipping payer, evidence, and inspection outcomes.

## `refundStatus`

Proposed values:

```text
REQUESTED → APPROVED → PROCESSING → SUCCEEDED
        └→ REJECTED
PROCESSING → FAILED → PROCESSING (explicit retry)
```

| From         | To           | Proposed guard                                       |
| ------------ | ------------ | ---------------------------------------------------- |
| `REQUESTED`  | `APPROVED`   | Authorized actor and validated amount/source.        |
| `REQUESTED`  | `REJECTED`   | Documented reason.                                   |
| `APPROVED`   | `PROCESSING` | Idempotent provider/finance request created.         |
| `PROCESSING` | `SUCCEEDED`  | Verified provider/finance settlement.                |
| `PROCESSING` | `FAILED`     | Definitive or retryable failure classified.          |
| `FAILED`     | `PROCESSING` | Explicit authorized retry with same refund identity. |

Open: refund destination, COD refund method, service-level target, manual approval thresholds, partial allocation, and whether store credit exists.

## Cross-status orchestration recommendations

- Do not confirm an online-paid order until the approved payment event or risk policy allows it.
- A payment failure must not erase an already-created order; expose retry or cancellation according to policy.
- Delivery does not automatically imply payment capture for COD without an explicit collection event.
- A return does not automatically imply a refund; inspection and refund decisions are separate.
- Cancellation after capture may initiate a refund; it must not directly set `paymentStatus=REFUNDED` before provider success.
- Partial bundle/component outcomes require line-level quantities even if the order-level status is aggregated.

## Customer-facing state acceptance

For every status surface:

- **Success:** show current state, timestamp, next expected step, and allowed action.
- **Loading:** preserve the last known state and label refresh progress without blocking navigation.
- **Empty:** explain when no shipment, payment, return, or refund record exists.
- **Error:** keep last known state, provide safe retry/support, and avoid claiming transition success.
- **Validation:** reject unsupported actions server-side and explain recoverable reasons.
- **Mobile:** use a readable vertical timeline, no horizontal-only status table, and touch targets of at least 44px.
- **Accessibility:** status text is not color-only; updates use appropriate live announcements without stealing focus.
- **Analytics:** record allowlisted transition-view/action events with status codes and correlation IDs, never personal/payment data.
