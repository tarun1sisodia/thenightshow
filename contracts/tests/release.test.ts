/**
 * Contract tests for the public release model and projection validation.
 * Boundary: release/build input validation.
 * Evidence: duplicate UUID/slug, draft/inactive leakage, legacy fleet keys,
 * and missing prices each fail with a distinct violation (Architecture.md §7,
 * Rules.md §7; Recovery Plan §8.1/§8.3/§9).
 */
import { describe, expect, it } from "vitest";
import {
  collectReleaseEntities,
  validatePublicCatalogRelease,
  type PublicCatalogRelease,
  type PublicRoute,
} from "../release.js";

function route(overrides: Partial<PublicRoute>): PublicRoute {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "agra-jaipur",
    entityType: "route",
    status: "published",
    isActive: true,
    sourceVersion: 1,
    updatedAt: "2026-10-09T00:00:00.000Z",
    fleetPrices: { sedan: 3500, ertiga: 4200 },
    ...overrides,
  };
}

function release(
  entities: Partial<PublicCatalogRelease["entities"]>,
): PublicCatalogRelease {
  return {
    releaseId: "rel_test0000000001",
    manifestVersion: 1,
    generatedAt: "2026-10-09T00:00:00.000Z",
    entities: {
      routes: [],
      tourPackages: [],
      localTours: [],
      transferRoutes: [],
      monuments: [],
      ...entities,
    },
  };
}

describe("public release validation", () => {
  it("accepts a valid release", () => {
    expect(validatePublicCatalogRelease(release({ routes: [route({})] }))).toEqual([]);
  });

  it("rejects duplicate UUIDs with a distinct violation", () => {
    const violations = validatePublicCatalogRelease(
      release({
        routes: [route({})],
        tourPackages: [
          {
            id: "00000000-0000-4000-8000-000000000001",
            slug: "agra-gwalior-golden-triangle",
            entityType: "tourPackage",
            status: "published",
            isActive: true,
            sourceVersion: 1,
            updatedAt: "2026-10-09T00:00:00.000Z",
            fleetPrices: { sedan: 9000 },
          },
        ],
      }),
    );
    expect(violations.some((v) => v.includes("duplicate UUID"))).toBe(true);
  });

  it("rejects duplicate slugs across different UUIDs and sections", () => {
    const violations = validatePublicCatalogRelease(
      release({
        routes: [route({})],
        transferRoutes: [
          {
            id: "00000000-0000-4000-8000-000000000002",
            slug: "agra-jaipur",
            entityType: "transferRoute",
            status: "published",
            isActive: true,
            sourceVersion: 1,
            updatedAt: "2026-10-09T00:00:00.000Z",
            fleetPrices: { sedan: 1200 },
          },
        ],
      }),
    );
    expect(violations.some((v) => v.includes("duplicate public slug"))).toBe(true);
  });

  it("rejects draft and archived records leaking into the release", () => {
    const draft = route({ status: "published" });
    const violations = validatePublicCatalogRelease(
      release({
        routes: [
          route({
            id: "00000000-0000-4000-8000-000000000003",
            slug: "draft-route",
          }),
          {
            ...draft,
            id: "00000000-0000-4000-8000-000000000004",
            slug: "archived-route",
            status: "archived" as never,
          },
        ],
      }),
    );
    expect(
      violations.some((v) => v.includes("non-published record")),
    ).toBe(true);
  });

  it("rejects inactive records", () => {
    const violations = validatePublicCatalogRelease(
      release({ routes: [route({ isActive: false })] }),
    );
    expect(violations.some((v) => v.includes("inactive record"))).toBe(true);
  });

  it("rejects legacy and unknown fleet keys in public prices", () => {
    const violations = validatePublicCatalogRelease(
      release({
        routes: [route({ fleetPrices: { innova: 4000 } as never })],
      }),
    );
    expect(violations.some((v) => v.includes("non-canonical fleet key"))).toBe(
      true,
    );
  });

  it("rejects missing or non-positive required prices", () => {
    const missing = validatePublicCatalogRelease(
      release({ routes: [route({ fleetPrices: {} })] }),
    );
    expect(missing.some((v) => v.includes("required fleet prices are missing"))).toBe(true);

    const nonPositive = validatePublicCatalogRelease(
      release({ routes: [route({ fleetPrices: { sedan: 0 } })] }),
    );
    expect(
      nonPositive.some((v) => v.includes("positive finite number")),
    ).toBe(true);
  });

  it("allows monuments without fleet prices", () => {
    const violations = validatePublicCatalogRelease(
      release({
        monuments: [
          {
            id: "00000000-0000-4000-8000-000000000005",
            slug: "taj-mahal",
            entityType: "monument",
            status: "published",
            isActive: true,
            sourceVersion: 1,
            updatedAt: "2026-10-09T00:00:00.000Z",
          },
        ],
      }),
    );
    expect(violations).toEqual([]);
  });

  it("requires a releaseId and a positive integer manifestVersion", () => {
    const violations = validatePublicCatalogRelease({
      ...release({}),
      releaseId: "",
      manifestVersion: 0,
    });
    expect(violations.some((v) => v.includes("releaseId is missing"))).toBe(true);
    expect(
      violations.some((v) => v.includes("manifestVersion must be a positive integer")),
    ).toBe(true);
  });

  it("collects entities across all sections", () => {
    const all = collectReleaseEntities(
      release({
        routes: [route({})],
        monuments: [
          {
            id: "00000000-0000-4000-8000-000000000006",
            slug: "agra-fort",
            entityType: "monument",
            status: "published",
            isActive: true,
            sourceVersion: 1,
            updatedAt: "2026-10-09T00:00:00.000Z",
          },
        ],
      }),
    );
    expect(all).toHaveLength(2);
  });
});
