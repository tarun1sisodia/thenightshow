# thenightshow — SK Baghel Tour & Travels

This repository hosts the **SK Baghel Tour & Travels** platform: an Agra-based
transportation and tour-booking product with three applications and a shared
contract package.

> **Naming note:** the canonical documentation set (stored under `docs/`) was
> authored for the `tarun1sisodia/ArenaAI` repository. Per the project owner,
> all work is performed in this repository (`tarun1sisodia/thenightshow`).
> The decision is recorded in `docs/project/Memory.md`; the canonical documents
> are stored verbatim.

## Documentation map

Start at [`docs/ArenaAI Documentation Index.md`](docs/ArenaAI%20Documentation%20Index.md).
Canonical documents:

- Product requirements: `docs/project/PRD.md`
- Architecture: `docs/project/Architecture.md`
- Engineering rules: `docs/project/Rules.md`
- Delivery phases: `docs/project/Phases.md`
- Design system: `docs/project/Design.md`
- Catalog recovery plan (detailed execution spec): `docs/CATALOG_PUBLISHING_RECOVERY_PLAN.md`
- Environment matrix: `docs/project/ENVIRONMENTS.md`
- Progress record: `docs/project/Memory.md`

## Structure

| Directory | Purpose |
|---|---|
| `contracts/` | Canonical cross-app contracts (fleet tiers, wire envelope, money, IDs, release model, observability) + registry |
| `backend/` | Fastify + TypeScript API (scaffold — built out in later phases) |
| `admin/` | React + Vite Admin panel (scaffold) |
| `react/` | React + Vite Customer site, Cloudflare Pages (scaffold) |
| `docs/` | Canonical and operational documentation |
| `scripts/` | Repository tooling (contract sync) |

## Execution contract (repository scripts)

```text
npm run install:all
npm run verify
npm run customer:typecheck
npm run admin:typecheck
npm run backend:typecheck
npm run customer:build
npm run admin:build
npm run backend:build
npm test
```

## Phase status

- **Phase 0 — Documentation and environment lock:** in progress. Canonical
  docs stored; environment matrix drafted (`docs/project/ENVIRONMENTS.md`);
  awaiting owner confirmation.
- **Phase 1 — Shared contracts and observability:** contracts package
  implemented with contract tests (`contracts/REGISTRY.md`).

One feature is built to end-to-end staging acceptance before the next begins
(`docs/project/Phases.md`). A green build alone is not feature completion.
