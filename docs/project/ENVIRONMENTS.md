# Environment Matrix — SK Baghel Tour & Travels

**Status:** Phase 0 deliverable (`docs/project/Phases.md` §3). Values marked
**TBD** must be confirmed by the project owner before staging work begins.
Never place production secrets in this file or in frontend env files.

## 1. Environments

| Concern | Local | Staging | Production |
|---|---|---|---|
| Customer site (`react/`) | Vite dev server | Cloudflare Pages **Preview** deploy | Cloudflare Pages **Production** deploy |
| Admin (`admin/`) | Vite dev server | Cloudflare Pages Preview | Cloudflare Pages Production |
| Backend (`backend/`) | Local Node process | Render staging service — **TBD** | Render production service — **TBD** |
| Database | Local Postgres / Supabase dev project — **TBD** | Supabase staging project — **TBD** | Supabase production project — **TBD** |
| Catalog content source | Local backend | Staging API base URL | Production API base URL |
| Deploy trigger | Manual | `PAGES_DEPLOY_HOOK_URL` (staging hook) | `PAGES_DEPLOY_HOOK_URL` (production hook) |

## 2. Customer build variables (Cloudflare Pages)

Established contract from `docs/CATALOG_PUBLISHING_RECOVERY_PLAN.md` §3. Verify
each configured value against the live environment; the build must fail closed
when a required source is unavailable.

| Variable | Used by | Purpose | Value |
|---|---|---|---|
| `VITE_API_BASE_URL` | Customer build + browser runtime | Backend base URL for API/manifest URLs | **TBD** (production API, never staging) |
| `VITE_BASE_PATH` | Vite/SSG asset paths | Site base path | `/` |
| `VITE_SUPABASE_URL` | Customer browser auth | Supabase project URL (same env as publish API) | **TBD** |
| `VITE_SUPABASE_ANON_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` | Customer browser auth | Public browser key (never a service-role key) | **TBD** |
| `VITE_REACT_MIGRATION_ENABLED` | Customer runtime | React migration feature switch | `false` unless migration fallback is needed |
| `ROUTE_CATALOG_MANIFEST_URL` | Customer build | Published route catalog source | **TBD** |
| `TOUR_PACKAGES_MANIFEST_URL` | Customer build | Published tour-package snapshot source | **TBD** |
| `LOCAL_PACKAGES_MANIFEST_URL` | Customer build | Published local-tour snapshot source | **TBD** |
| `TRANSFER_ROUTES_MANIFEST_URL` | Customer build | Published transfer-route snapshot source | **TBD** |
| `CONTENT_MANIFEST_URL` | Customer build | Content manifest source | **TBD** — implement the exact endpoint or remove in favor of one release endpoint |
| `CATALOG_API_URL` | Customer build | Legacy/compat source | Deprecated — prefer `VITE_API_BASE_URL`; fail on ambiguity |
| `PAGES_DEPLOY_HOOK_URL` | Backend publisher (not `VITE_*`) | Cloudflare Pages hook that starts a rebuild | **TBD** (Backend-side secret/config) |
| `NODE_VERSION` | Cloudflare build runtime | Node 22 (prerender uses `--experimental-strip-types`) | `22` |

## 3. API source URLs

| Source | URL | Notes |
|---|---|---|
| Public catalog release (target) | **TBD** | One atomic release endpoint; all sections share `releaseId`/`manifestVersion` |
| Staging API base | **TBD** | Preview builds may use staging; production must not |
| Production API base | **TBD** | Required; a missing value must fail the production build |

## 4. Ownership

| Role | Owner |
|---|---|
| Release owner (accepts releases, records release IDs) | **TBD** |
| Rollback owner (last-known-good release decisions) | **TBD** |
| Staging database/project | **TBD** |

## 5. Environment rules

- Production never reads staging content. A missing required variable fails
  the build; there is no silent fallback to staging or to old local JSON.
- Secrets stay server-side. Only public `VITE_*` values ship to the browser.
- A deploy hook only starts a build; deployment verification is a separate
  check (`docs/project/Architecture.md` §10).
- Every catalog build logs `releaseId`, `manifestVersion`, and item counts so
  environment mismatches are visible.
