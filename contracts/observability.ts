/**
 * Canonical observability context (docs/project/Phases.md Phase 1,
 * docs/CATALOG_PUBLISHING_RECOVERY_PLAN.md Phase 0).
 *
 * Every Admin/API/build log line for a catalog operation carries this context
 * so one request can be traced from Admin to release/build logs.
 */
import type { CatalogEntityType } from "./release.js";

export interface RequestContext {
  requestId: string;
  correlationId: string;
}

export interface CatalogLogContext extends RequestContext {
  actor?: string;
  entityType?: CatalogEntityType;
  entityId?: string;
  sourceVersion?: number;
  releaseId?: string;
  manifestVersion?: number;
}

/**
 * Release states Admin must show separately. A deploy-hook request only starts
 * work; deployment verification is a separate state (Architecture.md §10).
 */
export const RELEASE_STATES = [
  "database_saved",
  "publish_committed",
  "release_queued",
  "release_building",
  "release_deployed",
  "release_failed",
] as const;

export type ReleaseState = (typeof RELEASE_STATES)[number];

export type CatalogEventType =
  | "catalog.entity.saved"
  | "catalog.publish.committed"
  | "catalog.release.queued"
  | "catalog.release.building"
  | "catalog.release.deployed"
  | "catalog.release.failed";
