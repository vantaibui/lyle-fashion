# Admin architecture decision

**Status: APPROVED FOR PHASE 12 FOUNDATION — re-evaluate before every future phase that changes scope, team size, or deployment topology.**

## Context

LYLE Fashion is currently a single Next.js App Router application (`lyle-fashion-storefront`) with no workspace tooling, one `package.json`, one `tsconfig.json`, one deployment artifact, and no CI/CD workflows configured yet (`.github/skills` only). Storefront authentication (`docs/AUTHENTICATION.md`) is an explicitly **development-only** demo cookie adapter with no roles, no MFA, and no production identity contract. `docs/OPEN-QUESTIONS.md` records `ADM-01` ("which operations are handled by provider tools versus a custom Admin application?") and `ADM-03` (MFA/session/network requirements for staff) as **MVP blockers**. `docs/MVP-ROADMAP.md` explicitly does not assume a custom admin is required at all.

This document resolves the architecture question — where admin code lives and how it is deployed and secured relative to the storefront — before any admin implementation. It does not resolve `ADM-01`/`ADM-03` in full (those require a business/identity-owner decision) but it establishes the technical foundation that any future answer can build on without a rewrite.

## Options considered

### Option A — Same Next.js application (admin routes inside the storefront app)

Admin pages live under a new route group, e.g. `src/app/(admin)/admin/**`, in the existing app, sharing `node_modules`, build, and deployment with the storefront.

**Advantages**

- Zero new tooling; fastest to start.
- Trivial code sharing (design tokens, `lib/api`, validation schemas) — same `src/` tree, same `@/` aliases.
- One build, one deploy, one Vercel/host project.

**Disadvantages**

- Storefront and admin share one Next.js middleware, one CSP, one cookie namespace, and one dependency/attack surface by default. A defect or dependency vulnerability in admin code (e.g., a rich-text editor, table/grid library) ships to the public storefront bundle and vice versa.
- No deployment independence: a broken admin build blocks a storefront hotfix and vice versa; a storefront traffic spike or incident touches the same runtime as staff tooling.
- Authentication boundary is easy to blur. The existing storefront session cookie (`lyle_session`, customer-scoped) sits in the same app as staff session handling, which is exactly the customer/staff auth conflation `docs/SECURITY-GUIDELINES.md` and this task explicitly forbid ("Do not reuse storefront customer authentication without explicit approval").
- Public-facing security headers/CSP and admin-appropriate headers (e.g., stricter frame/caching rules, no public search-engine exposure) must be reconciled per-route instead of per-app, raising the chance of an admin route accidentally inheriting public caching or indexing.
- Bundle separation relies entirely on route-level code-splitting discipline; nothing structurally prevents an admin-only dependency from leaking into a shared chunk.

### Option B — Monorepo (`apps/storefront`, `apps/admin`, `packages/*`)

Two Next.js applications in one repository with a pnpm workspace, sharing selected packages.

**Advantages**

- Deployment independence: separate builds, separate environments, separate rollout/rollback, separate incident blast radius.
- Separate authentication boundary by construction — admin gets its own middleware, cookie namespace, CSP, and header policy; there is no shared app instance to misconfigure.
- Shared contracts (`packages/contracts` — Zod schemas, domain types, permission/role enums, status-transition definitions) stay a single source of truth instead of duplicated or drifting between two repos.
- Shared design tokens (`packages/design-system`) let admin adopt an operational density layer while still inheriting brand color/typography primitives, satisfying "reuse foundation tokens when appropriate, but allow an operational admin layer."
- CI can scope checks per affected app/package once configured, keeping validation fast as the codebase grows.
- Matches the existing document ownership model (`src/modules`, `src/lib/api`, `src/design-system`) — those become workspace packages with the same boundaries, not a new mental model.
- Leaves room for a future mobile or POS client to depend on `packages/contracts` without duplicating domain types a third time.

**Disadvantages**

- New tooling: pnpm workspaces, per-app `tsconfig`/`eslint`/`next.config`, shared package versioning, and CI changes to build/test both apps.
- Slightly slower initial setup than Option A.
- Requires discipline to avoid a "giant shared package" (explicitly called out to avoid) — shared packages must justify inclusion, not default to it.
- Two Next.js dev servers locally (acceptable; independent ports).

### Option C — Separate repositories

Storefront and admin live in entirely separate Git repositories; shared code is published as versioned packages (private npm registry or Git-based packages).

**Advantages**

- Strongest deployment and ownership isolation; independent CI/CD, independent access control at the repository level (e.g., admin repo restricted to a smaller engineer group).
- Clean security perimeter — no way for a storefront dependency to accidentally reach admin code at the filesystem level.

**Disadvantages**

- Requires a private package registry (or Git-dependency workflow) and a versioning/release process for every shared contract change — significant process overhead for a team currently running one repo with no CI.
- Shared contract drift risk is highest here: a Zod schema or permission enum change must be published, bumped, and upgraded in both repos, which is easy to skip under deadline pressure — directly risking the "server-side permission enforcement" and "authoritative price/inventory validation" invariants this project treats as non-negotiable.
- No evidence in this repository of multiple teams, multiple deploy cadences, or existing publishing infrastructure that would justify this cost today.
- Highest repository complexity and developer experience cost of the three options, with no corresponding benefit at current team/product size.

## Comparison

| Dimension                   | A: Same app                              | B: Monorepo                                       | C: Separate repos                          |
| --------------------------- | ---------------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| Team ownership              | Blurred                                  | Clear per app, shared packages reviewed by both   | Clearest, highest process cost             |
| Deployment independence     | None                                     | Yes                                               | Yes                                        |
| Security boundary           | Weak (shared runtime/cookies/CSP)        | Strong (separate app, separate auth)              | Strongest                                  |
| Authentication model fit    | Conflates customer/staff — disallowed    | Separate identity boundary by construction        | Separate, but highest integration overhead |
| Release cadence             | Coupled                                  | Independent                                       | Independent                                |
| Shared design system        | Trivial (same tree)                      | Good (`packages/design-system`)                   | Requires publishing                        |
| Shared domain contracts     | Trivial but blurs domain ownership       | Good (`packages/contracts`)                       | Requires publishing/versioning             |
| CI/CD complexity            | Lowest (none exists yet)                 | Moderate, scoped by affected project              | Highest                                    |
| Bundle separation           | Manual discipline only                   | Structural (separate app builds)                  | Structural                                 |
| Environment separation      | Manual (per-route env checks)            | Structural (separate env files per app)           | Structural                                 |
| Hosting                     | One project                              | Two projects, one repo                            | Two projects, two repos                    |
| Scaling to mobile/POS later | Poor                                     | Good — add `apps/mobile` reusing `packages/*`     | Requires a third repo + more publishing    |
| Repository complexity       | Lowest                                   | Moderate                                          | Highest                                    |
| Developer experience        | Simple but risk hidden in shared runtime | One `git clone`, workspace-aware tooling          | Context-switching between repos            |
| Testing                     | Shared Vitest/Playwright config          | Per-app config, shared `packages/testing` helpers | Duplicated config and fixtures             |
| Maintenance                 | Cheapest short-term, riskiest long-term  | Balanced                                          | Most process overhead                      |

## Security implications

Admin surfaces require staff-only authentication, MFA consideration, role/permission enforcement, and audit logging — none of which apply to storefront customers. Option A structurally invites cross-contamination between the customer session cookie and a future staff session cookie, and between public CSP/caching headers and admin-appropriate ones. Option B isolates the admin app's middleware, cookie namespace, CSP, and cache headers by construction while still letting both apps validate against one shared permission/role contract package, so "permissions must be enforced server-side" stays a single implementation instead of two. Option C offers the same isolation with more process cost and higher risk of contract drift between repos, which directly threatens server-side authorization correctness (a stale permission enum in one repo is a real vulnerability, not just a bug).

## CI/CD implications

No CI currently exists (only Husky pre-commit hooks and lint-staged). Option A requires no immediate CI change but leaves quality gates coupled indefinitely. Option B requires introducing a pnpm workspace and either a single CI workflow that runs both apps' checks or an affected-project-aware setup later (e.g., Turborepo/Nx can be added when the pain justifies it — not required for this phase). Option C requires two independently maintained CI pipelines plus a package-publishing pipeline from day one.

## Decision override

The analysis above recommends Option B on security-boundary and deployment-independence grounds. The product/engineering owner reviewed this analysis and explicitly chose **Option A (same Next.js application)** for this phase, accepting its documented disadvantages in exchange for avoiding a full-repository migration before any admin code exists. This is a recorded trade-off, not a reversal of the analysis: the risks below are accepted, not resolved.

**Accepted risks under Option A:**

- Admin and storefront share one Next.js runtime, one CSP, one build, and one deploy. An admin incident or dependency issue can affect the storefront and vice versa.
- The customer session cookie (`lyle_session`) and the new staff session cookie must coexist in the same app. This phase mitigates — but does not eliminate — the conflation risk by giving admin its own cookie name, its own session contract, and its own `requireAdminAuth` boundary that never accepts a customer session, so the two identity systems remain logically separate even though they run in one process.
- Bundle separation between admin and storefront relies on route-level code-splitting discipline (Next.js automatically code-splits by route, so admin-only dependencies are not sent to storefront pages by default, but nothing structurally prevents a future shared import from crossing the boundary — code review must enforce this).
- Admin routes must carry their own headers (`X-Robots-Tag: noindex`, `Cache-Control: private, no-store`) per-route since there is no separate app-level header policy.

**Migration trigger — revisit Option B (monorepo) when any of the following becomes true:**

- A distinct admin/ops engineering team forms with different review ownership than the storefront team.
- Admin and storefront need independent release cadences (e.g., staff tooling must ship without a storefront deploy, or vice versa).
- `ADM-01`/`ADM-03` are resolved with a production identity provider that itself expects a separately deployed application (e.g., an IdP redirect target that should not share a domain/runtime with public storefront traffic).
- The admin route group's dependencies (data-grid, rich text, charting) measurably grow the storefront's shared bundle or build time.

Until then, this document's Option A implementation below is the approved foundation. The comparison, security, and CI/CD analysis above remain valid inputs for that future re-evaluation and are not being discarded.

## Recommended option (analysis): B — Monorepo, minimally scoped

This section is retained as the underlying analysis and the reference plan for the migration trigger above. It is **not** what is being implemented in this phase — see "Decision override."

Adopt a pnpm workspace with `apps/storefront` (the existing app, moved as-is) and `apps/admin` (new), plus only the shared packages that have a demonstrated current need:

```text
apps/
├── storefront/          # existing src/ tree, moved unchanged
└── admin/                # new Next.js app, admin-only

packages/
├── contracts/            # Zod schemas + domain types shared by both apps (roles, permissions, status enums, money/VND types)
├── design-system/        # CSS-variable tokens + foundations, already isolated in src/design-system today
├── config/                # typed env schema helpers (pattern from src/config/env, generalized)
├── eslint-config/         # shared flat config base
├── typescript-config/     # shared tsconfig base
└── testing/               # shared Vitest/RTL setup, Playwright fixtures
```

`packages/utils` is deliberately **not** created yet — no demonstrated cross-app utility exists today beyond what `packages/contracts` and `packages/design-system` already cover, and an empty-justification shared package is explicitly disallowed by this task's constraints.

This satisfies every "prefer a monorepo when" condition in the task brief: storefront and admin will share contracts (roles/permissions/status enums/money types), deployment independence is required (staff tooling cannot go down with a storefront incident, and vice versa), different UI patterns are needed (operational density vs. editorial storefront), separate environment/security boundaries are useful (staff auth must not share the customer cookie), and the team can maintain workspace tooling (pnpm is already the package manager; this is an incremental addition, not a new toolchain).

It does **not** go to Option C because there is no current evidence of separate teams, separate release cadences, or existing publishing infrastructure that would justify the process overhead — that cost is the dominant disadvantage the task explicitly asks to weigh against benefit.

## Rejected options (for this phase)

- **Option B (monorepo):** the stronger security/deployment posture, but rejected for _this phase_ by the product/engineering owner to avoid migrating the entire repository before any admin code exists. Recorded as the migration target — see "Migration trigger" above.
- **Option C (separate repos):** rejected because the team/tooling/CI evidence in this repository does not justify the publishing and process overhead. Revisit only alongside Option B if a distinct admin team or compliance requirement emerges.

## Approved implementation plan (Option A)

1. Add an `(admin)` route group under `src/app/(admin)/admin/**`, parallel to the existing `(storefront)` and `(account)` groups. Public paths remain `/admin/**`.
2. Give admin its own staff session contract and cookie (e.g., `lyle_admin_session`), distinct in name, shape, and storage from the customer `lyle_session` cookie. `requireAdminAuth` never accepts or falls back to a customer session, and `requireAuth` (storefront) never accepts a staff session.
3. Define roles and permissions as data (`src/modules/admin-auth/contracts`), not hard-coded per-route checks, so authorization stays enforceable server-side and centrally auditable.
4. Add admin-specific response headers per route/segment (`X-Robots-Tag: noindex`, `Cache-Control: private, no-store`) since there is no separate app-level header policy to rely on.
5. Keep admin-only dependencies (future data-grid, rich text, etc.) imported only from admin route files so Next.js route-level code-splitting keeps them out of storefront bundles; this is a code-review discipline, not a structural guarantee, and is the primary risk this phase accepts.
6. Reuse `src/design-system` tokens and `src/lib/api`/`src/lib/validation` foundations as-is; add an admin-only presentation layer (`src/modules/admin-*` and, if a visually distinct operational layer is needed, `src/design-system` additions scoped to admin) rather than duplicating tokens.
7. No workspace, build, or CI restructuring is required for this phase; `pnpm validate` and `pnpm build` continue to cover the whole app, including admin routes.

## Risks

- **Shared runtime:** admin and storefront share one Next.js process, one CSP, one build, one deploy. An admin dependency or incident can affect the storefront and vice versa. Accepted for this phase; see "Migration trigger."
- **Auth boundary discipline is code-level, not structural:** cookie names and session contracts are kept separate by convention and server-side checks (`requireAdminAuth` vs. `requireAuth`), not by process/runtime isolation. A future code-review lapse could weaken this; the mitigation is that both boundary functions live in different modules with no shared code path, and tests assert a customer session cannot satisfy `requireAdminAuth` and vice versa.
- **Bundle separation is a discipline, not a guarantee.** Route-level code-splitting keeps admin-only dependencies out of storefront chunks by default, but a shared import (e.g., a component imported by both an admin and a storefront page) can defeat this silently. Watch bundle-analyzer output as admin grows.
- **Auth boundary is still unresolved at the identity-provider level:** this decision fixes that admin has its own session/cookie namespace, but not which identity provider issues staff sessions (`ADM-01`/`ADM-03` remain open business/security decisions). This phase implements a self-contained development-only admin auth adapter so the eventual production identity provider is a swap, not a rearchitecture.
- **No CI exists today.** Admin routes are covered by the same `pnpm validate`/`pnpm build` used today; a CI workflow is not introduced in this phase because it was out of the approved scope for this specific decision.

## Preconditions

- This decision does not authorize implementing every admin module — see `docs/ADMIN-FUNCTIONAL-SCOPE.md` and `docs/ADMIN-ROADMAP.md` for phased scope.
- `ADM-01` (provider tools vs. custom admin ownership per module) and `ADM-03` (MFA/session/network requirements for staff) remain open and must be resolved with a business/security owner before any admin auth adapter here is treated as production-ready.
- Any future migration to Option B must follow the "Migration plan" in the retained analysis section below, executed as an atomic, independently reviewed step before new admin feature work resumes.

## Migration plan (retained for the future Option B trigger)

1. Introduce `pnpm-workspace.yaml` at the repo root listing `apps/*` and `packages/*`.
2. Move the existing app content into `apps/storefront/` with **no behavior change**: `src/`, `public/`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind`/design-token setup, `vitest.config.ts`, `playwright.config.ts`, `.storybook/`, and the storefront's `package.json` (renamed `lyle-fashion-storefront`, workspace-scoped).
3. Extract `packages/design-system` from `src/design-system` and `packages/contracts` for the admin role/permission/status types plus any currently-duplicated Zod schemas the two apps share (e.g., money/VND, pagination, status enums from `STATUS-TRANSITIONS.md`). Extract `packages/config`, `packages/eslint-config`, `packages/typescript-config`, and `packages/testing` as thin bases.
4. Move `src/app/(admin)` into `apps/admin` as its own Next.js App Router project with its own `package.json`, `next.config.ts`, and `tsconfig.json` extending `packages/typescript-config`; its existing `requireAdminAuth` boundary and staff cookie carry over unchanged.
5. Update root `package.json` scripts to fan out `format`/`lint`/`typecheck`/`test`/`build` across workspaces (`pnpm -r`) while keeping a single `pnpm validate` entry point.
6. Add a root `.github/workflows/ci.yml` running install, format check, lint, typecheck, unit tests, and both apps' builds.
7. Re-run `pnpm skills:verify` and confirm `.agents/skills` adapter generation is unaffected by the workspace move.

This remains a filesystem/tooling migration only when executed — no route, component, or business logic changes — validated by unchanged `pnpm build` output and unchanged Playwright journeys for both apps.
