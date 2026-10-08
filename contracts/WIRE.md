# Wire Rules (canonical summary)

This document summarizes the canonical wire rules. The TypeScript sources in
this package are the machine-checkable source of truth; when this document and
the code disagree, fix the document.

## 1. Naming

- Database fields: `snake_case`.
- API wire fields: `camelCase`.
- Customer/Admin TypeScript: `camelCase`.
- Deliberate compressed manifests are versioned separately.

## 2. Response envelope

Success (source: `wire.ts`):

```json
{ "success": true, "data": {}, "requestId": "req_..." }
```

Failure (source: `wire.ts`):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Readable summary",
    "fields": { "fieldName": "Reason" },
    "requestId": "req_..."
  }
}
```

No module may introduce a third response shape.

Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`,
`CONFLICT`, `STALE_VERSION`, `UNAVAILABLE`, `INTERNAL_ERROR`.

## 3. Money

- Database and payment boundaries: integer minor units (paise).
- API wire, pricing engine, and display: rupees as numbers.
- Conversion occurs once, at the payment boundary (`money.ts`).
- Sub-paise precision is rejected, never silently rounded.

## 4. Identifiers

- `requestId` (`req_...`): one per HTTP request.
- `correlationId` (`cor_...`): traces one Admin action across Admin, Backend,
  database, release, build, and deploy logs.
- `releaseId` (`rel_...`): one public catalog release.
- Publication idempotency key: `catalog:{entityType}:{entityId}:{sourceVersion}`.

Source: `ids.ts`.

## 5. Public release

Shape (source: `release.ts`):

```ts
interface PublicCatalogRelease {
  releaseId: string;
  manifestVersion: number;
  generatedAt: string;
  entities: {
    routes: PublicRoute[];
    tourPackages: PublicTourPackage[];
    localTours: PublicLocalTour[];
    transferRoutes: PublicTransferRoute[];
    monuments: PublicMonument[];
  };
}
```

Projection rules enforced by `validatePublicCatalogRelease`:

- Only explicitly published and active records.
- Exactly one item per UUID and per public slug, across all sections.
- Canonical fleet keys only (`sedan`, `ertiga`, `innova-crysta`,
  `tempo-traveller`, `urbania`); legacy keys are never emitted.
- Required fleet prices present and positive for commercial entities.
- One `releaseId` and `manifestVersion` shared by all sections.

The Customer build must fail (exit non-zero) when validation returns any
violation.

## 6. Observability

Every catalog log line carries `CatalogLogContext` (source:
`observability.ts`): `requestId`, `correlationId`, and optionally `actor`,
`entityType`, `entityId`, `sourceVersion`, `releaseId`, `manifestVersion`.

Release states shown separately in Admin: `database_saved`,
`publish_committed`, `release_queued`, `release_building`, `release_deployed`,
`release_failed`.
