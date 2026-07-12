# Authentication

**Status: DEVELOPMENT FOUNDATION; production identity contract is BLOCKED.**

## Implemented reference flow

`/login` posts credentials to a same-origin route. The development adapter validates one clearly disclosed demo account and returns a development-only `lyle_session` cookie with `HttpOnly`, `SameSite=Lax`, an eight-hour lifetime, and `Secure` in production mode. Its non-secret fixed demo value allows local Next.js workers to share the fixture; it is explicitly not opaque production authentication. No credential or session token is stored in browser storage. Logout expires the cookie.

Account Server Components call `requireAuth` before reading private data. Missing or expired sessions redirect to `/login?returnTo=…`; `returnTo` accepts only local non-login paths. APIs repeat authentication and ownership checks and return `Cache-Control: private, no-store`. UI visibility is never treated as authorization.

Forgot-password responses are deliberately generic to limit account enumeration. Registration, reset-token consumption, session refresh, lockout, disabled accounts, account creation after checkout, OTP, social login, and production cart/wishlist merge are not implemented because no identity contract approves them.

## Production preconditions

- Select an identity owner and approve login, verification, lockout, password, refresh, revocation, CSRF, and rate-limit contracts.
- Replace the in-memory demo adapter; remove demo credentials and seed customer data.
- Define guest-to-customer cart and wishlist merge endpoints with deterministic conflict summaries.
- Define account-deletion re-authentication, legal retention, audit, and status contracts.
- Perform threat modeling, penetration testing, and multi-instance session validation.

The development adapter is not a launch authentication system and must not receive real personal data.
