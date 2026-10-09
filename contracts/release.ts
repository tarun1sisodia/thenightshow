/**
 * Canonical public release model and projection validation
 * (docs/project/Architecture.md §7, docs/project/Rules.md §7).
 *
 * Every catalogue entity has a private business record and a public
 * projection. Only explicitly published and active records enter the public
 * release. The release carries one releaseId and one manifestVersion shared
 * by all sections.
 */
import {
  isCanonicalVehicleTier,
  type VehicleTier,
} from "./enums/vehicle-tiers.js";

export type PublicationStatus = "draft" | "published" | "archived";

export type CatalogEntityType =
  | "route"
  | "tourPackage"
  | "localTour"
  | "transferRoute"
  | "monument";

export interface PublicEntityBase {
  /** Database UUID. */
  id: string;
  /** Stable public identifier used for URLs, search, and booking handoff. */
  slug: string;
  entityType: CatalogEntityType;
  /** Public projections are always "published"; drafts never appear here. */
  status: "published";
  isActive: boolean;
  sourceVersion: number;
  updatedAt: string;
}

/** Commercial entities carry display-ready fleet prices in rupees. */
export interface FleetPricedEntity {
  fleetPrices: Partial<Record<VehicleTier, number>>;
}

export interface PublicRoute extends PublicEntityBase, FleetPricedEntity {
  entityType: "route";
}

export interface PublicTourPackage
  extends PublicEntityBase,
    FleetPricedEntity {
  entityType: "tourPackage";
}

export interface PublicLocalTour extends PublicEntityBase, FleetPricedEntity {
  entityType: "localTour";
}

export interface PublicTransferRoute
  extends PublicEntityBase,
    FleetPricedEntity {
  entityType: "transferRoute";
}

/** Monuments are public content; they do not carry transport prices. */
export interface PublicMonument extends PublicEntityBase {
  entityType: "monument";
}

export type PublicCatalogEntity =
  | PublicRoute
  | PublicTourPackage
  | PublicLocalTour
  | PublicTransferRoute
  | PublicMonument;

export interface PublicCatalogRelease {
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

/** All entities in a release, flattened across sections. */
export function collectReleaseEntities(
  release: PublicCatalogRelease,
): PublicCatalogEntity[] {
  const { routes, tourPackages, localTours, transferRoutes, monuments } =
    release.entities;
  return [...routes, ...tourPackages, ...localTours, ...transferRoutes, ...monuments];
}

/**
 * Validate a public release against the projection rules. Returns a list of
 * human-readable violations; an empty list means the release is acceptable.
 * The build must fail (exit non-zero) when this returns any violation.
 *
 * Rules enforced:
 * - releaseId present; manifestVersion is a positive integer;
 * - only explicitly published and active records;
 * - exactly one item per UUID and per public slug (across all sections);
 * - canonical fleet keys only (legacy keys never emitted);
 * - required prices present and positive for commercial entities.
 */
export function validatePublicCatalogRelease(
  release: PublicCatalogRelease,
): string[] {
  const violations: string[] = [];

  if (!release.releaseId) {
    violations.push("releaseId is missing");
  }
  if (!Number.isInteger(release.manifestVersion) || release.manifestVersion < 1) {
    violations.push("manifestVersion must be a positive integer");
  }

  const entities = collectReleaseEntities(release);
  const seenIds = new Map<string, string>();
  const seenSlugs = new Map<string, string>();

  for (const entity of entities) {
    const label = `${entity.entityType} "${entity.slug}" (${entity.id})`;

    if (entity.status !== "published") {
      violations.push(`${label}: public release contains a non-published record`);
    }
    if (!entity.isActive) {
      violations.push(`${label}: public release contains an inactive record`);
    }

    const idOwner = seenIds.get(entity.id);
    if (idOwner !== undefined) {
      violations.push(
        `${label}: duplicate UUID also used by ${idOwner}`,
      );
    } else {
      seenIds.set(entity.id, label);
    }

    const slugOwner = seenSlugs.get(entity.slug);
    if (slugOwner !== undefined) {
      violations.push(
        `${label}: duplicate public slug also used by ${slugOwner}`,
      );
    } else {
      seenSlugs.set(entity.slug, label);
    }

    if (entity.entityType !== "monument") {
      const prices = entity.fleetPrices;
      const keys = Object.keys(prices);
      if (keys.length === 0) {
        violations.push(`${label}: required fleet prices are missing`);
      }
      for (const [tier, price] of Object.entries(prices)) {
        if (!isCanonicalVehicleTier(tier)) {
          violations.push(`${label}: non-canonical fleet key "${tier}"`);
        }
        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
          violations.push(
            `${label}: fleet price for "${tier}" must be a positive finite number`,
          );
        }
      }
    }
  }

  return violations;
}
