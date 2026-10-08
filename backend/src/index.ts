/**
 * Backend application entry point (Phase 1 scaffold).
 *
 * The Fastify server, domain modules, database wiring, and publication
 * pipeline are implemented in later phases per docs/project/Phases.md:
 *   Phase 2  — Fleet Master
 *   Phase 3  — Fare rules and quote authority
 *   Phase 4+ — Routes and the other catalogue verticals
 *
 * Canonical cross-app contracts are synced into src/contracts/ by
 * `npm run contracts:sync` (canonical source: contracts/).
 */
export const BACKEND_SCAFFOLD_MARKER = "skb-backend-scaffold" as const;
