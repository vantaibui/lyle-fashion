# Shared component boundaries

- `ui/`: domain-neutral accessible primitives.
- `commerce/`: reusable components that understand approved commerce types.
- `layout/`: shared structural composition only.

The LYLE Quiet Premium foundations now live in these directories. See `docs/COMPONENT-GUIDELINES.md` before extending them. Import concrete files directly; do not add a barrel export.
