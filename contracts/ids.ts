/**
 * Canonical identifier formats (docs/project/Architecture.md §8,
 * docs/CATALOG_PUBLISHING_RECOVERY_PLAN.md Phase 0/3).
 *
 * - requestId:      per HTTP request            (req_...)
 * - correlationId:  traces one Admin action end to end across Admin, Backend,
 *                   database, release, build, and deploy logs (cor_...)
 * - releaseId:      one public catalog release  (rel_...)
 */

export const REQUEST_ID_PREFIX = "req";
export const CORRELATION_ID_PREFIX = "cor";
export const RELEASE_ID_PREFIX = "rel";

const ID_PATTERN = /^[a-z]+_[a-z0-9]+$/;

function createId(prefix: string): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}${random}`;
}

export function createRequestId(): string {
  return createId(REQUEST_ID_PREFIX);
}

export function createCorrelationId(): string {
  return createId(CORRELATION_ID_PREFIX);
}

export function createReleaseId(): string {
  return createId(RELEASE_ID_PREFIX);
}

export function isRequestId(value: string): boolean {
  return value.startsWith(`${REQUEST_ID_PREFIX}_`) && ID_PATTERN.test(value);
}

export function isCorrelationId(value: string): boolean {
  return value.startsWith(`${CORRELATION_ID_PREFIX}_`) && ID_PATTERN.test(value);
}

export function isReleaseId(value: string): boolean {
  return value.startsWith(`${RELEASE_ID_PREFIX}_`) && ID_PATTERN.test(value);
}

/**
 * Deterministic idempotency key for publication events
 * (docs/CATALOG_PUBLISHING_RECOVERY_PLAN.md Phase 3, step 3).
 * Retries with the same key must not duplicate the release.
 */
export function catalogIdempotencyKey(
  entityType: string,
  entityId: string,
  sourceVersion: number,
): string {
  return `catalog:${entityType}:${entityId}:${sourceVersion}`;
}
