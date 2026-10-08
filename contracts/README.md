# @skb/contracts

Canonical cross-app contracts for SK Baghel Tour & Travels.

- `enums/vehicle-tiers.ts` — canonical fleet tiers and the read-only legacy
  map. This file is also synced into `backend/`, `admin/`, and `react/` by the
  contract sync process (`npm run contracts:sync`).
- `wire.ts` — API response envelope and error codes.
- `money.ts` — paise/rupees conversion at the payment boundary.
- `ids.ts` — request/correlation/release ID formats and the publication
  idempotency key.
- `release.ts` — public release model and projection validation.
- `observability.ts` — log context and release states.

See `REGISTRY.md` for the source/consumer/test map and `WIRE.md` for the wire
rules summary. Contract tests live in `tests/` and run with `npm test`.
