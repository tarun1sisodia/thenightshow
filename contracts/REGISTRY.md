# Contract Registry

Canonical contract sources live in this package. Consumers must not hand-edit
mirrored copies: file-based contracts are produced by the contract sync
process (`npm run contracts:sync`, script `scripts/sync-contracts.mjs`), and
the remaining contracts are consumed from this workspace package.

| Contract | Canonical source | Consumers | Tests |
|---|---|---|---|
| Canonical vehicle tiers + read-only legacy map | `contracts/enums/vehicle-tiers.ts` | Synced file copies: `backend/src/contracts/vehicle-tiers.ts`, `admin/src/contracts/vehicle-tiers.ts`, `react/src/contracts/vehicle-tiers.ts` | `contracts/tests/vehicle-tiers.test.ts` |
| API response envelope + error codes | `contracts/wire.ts` | `@skb/contracts` (Backend, Admin, Customer) | `contracts/tests/wire.test.ts` |
| Money units (paise ↔ rupees) | `contracts/money.ts` | `@skb/contracts` | `contracts/tests/money.test.ts` |
| Request/correlation/release IDs + idempotency key | `contracts/ids.ts` | `@skb/contracts` | covered by `wire.test.ts` / `release.test.ts` |
| Public release model + projection validation | `contracts/release.ts` | `@skb/contracts` (Backend publisher, Customer build) | `contracts/tests/release.test.ts` |
| Observability context + release states | `contracts/observability.ts` | `@skb/contracts` (Admin, Backend, build logs) | — |

## Rules

- Define or update the contract here before editing consumers (Rules.md §3).
- Wire fields are camelCase; database fields are snake_case.
- Never create a third casing or a second meaning for the same field.
- Unknown enum keys fail with a named validation error.
- After changing a synced source, run `npm run contracts:sync` and commit the
  regenerated copies together with the source change.
