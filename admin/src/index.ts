/**
 * Admin application entry point (Phase 1 scaffold).
 *
 * Admin manages content exclusively through Backend APIs; it never imports
 * database clients or writes SQL (docs/project/Rules.md §4). The React +
 * Vite application shell, auth, and entity forms are implemented in later
 * phases per docs/project/Phases.md.
 *
 * Canonical cross-app contracts are synced into src/contracts/ by
 * `npm run contracts:sync` (canonical source: contracts/).
 */
export const ADMIN_SCAFFOLD_MARKER = "skb-admin-scaffold" as const;
