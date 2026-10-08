/**
 * Customer application entry point (Phase 1 scaffold).
 *
 * The Customer site renders the verified public release; it does not decide
 * publication, invent prices, or authorize bookings
 * (docs/project/Rules.md §8). The React + Vite application, resolvers,
 * templates, and SSG scripts are implemented in later phases per
 * docs/project/Phases.md.
 *
 * Canonical cross-app contracts are synced into src/contracts/ by
 * `npm run contracts:sync` (canonical source: contracts/).
 */
export const CUSTOMER_SCAFFOLD_MARKER = "skb-customer-scaffold" as const;
