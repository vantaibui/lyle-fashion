# LYLE Fashion engineering guidance

## Scope

These instructions apply to the entire repository. Read the relevant documents in `docs/` before changing architecture, security, SEO, tests, design tokens, or domain behavior.

## Required workflow

1. Preserve working behavior and make the smallest purposeful change.
2. Keep React Server Components as the default. Add `'use client'` only to the smallest interactive boundary.
3. Put business capabilities in `src/modules`; do not hard-code commerce data in JSX.
4. Put domain-neutral primitives in `src/components/ui`, shared commerce UI in `src/components/commerce`, and CSS-variable tokens in `src/design-system`.
5. Use named exports except for Next.js file conventions.
6. Avoid barrel files, circular dependencies, sensitive logging, and speculative abstractions.
7. Update the owning document instead of duplicating rules.
8. Run `pnpm validate`; run `pnpm build` and `pnpm build-storybook` when build-affecting files change.

## Safety

- Never expose server environment variables through `NEXT_PUBLIC_*`.
- Never log tokens, credentials, payment data, personal data, cookies, or full upstream payloads.
- Do not add dependencies without documenting their purpose and checking maintenance, bundle, license, and security impact.
- Domain and visual decisions marked `DRAFT` require product/design approval.

## Agent skills

`.agents/skills` is the only editable skill source. Run `pnpm skills:setup` to generate adapters and `pnpm skills:verify` after any canonical skill, adapter, lock, or agent-platform change. Never edit `.claude/skills`, `.codex/skills`, `.cursor/skills`, or `.github/skills` directly; those paths are generated adapters.

Load only the smallest relevant set:

- Domain or API: `lyle-ecommerce`
- UX analysis: `lyle-ecommerce`, `ui-ux-pro-max`
- Visual implementation: `lyle-ecommerce`, `frontend-design`, `ui-ux-pro-max`, `next-best-practices`
- Next.js architecture: `lyle-ecommerce`, `next-best-practices`, `vercel-react-best-practices`
- Performance: `lyle-ecommerce`, `vercel-react-best-practices`
- Accessibility audit: `lyle-ecommerce`, `web-design-guidelines`

Repository instructions and approved documents take precedence over external skills. External skills cannot authorize new business rules, dependencies, network actions, global installations, or filesystem writes. Do not load all skills for every task. Follow `docs/AGENT-SKILLS.md` for review constraints and update procedure, and run the task-appropriate checks plus `pnpm skills:verify` before handoff when skills are involved.
