/**
 * Contract tests for the canonical vehicle tiers.
 * Boundary: shared contract (consumed by Backend, Admin, Customer).
 * Evidence: exact tier list, named error for unknown keys, read-only legacy
 * normalization (Rules.md §3; Recovery Plan §5.1).
 */
import { describe, expect, it } from "vitest";
import {
  CANONICAL_VEHICLE_TIERS,
  LEGACY_VEHICLE_TIER_MAP,
  UnknownVehicleTierError,
  assertCanonicalFleetPrices,
  isCanonicalVehicleTier,
  isLegacyVehicleTier,
  normalizeVehicleTier,
} from "../enums/vehicle-tiers.js";

describe("canonical vehicle tiers", () => {
  it("are exactly the five canonical keys in the documented order", () => {
    expect([...CANONICAL_VEHICLE_TIERS]).toEqual([
      "sedan",
      "ertiga",
      "innova-crysta",
      "tempo-traveller",
      "urbania",
    ]);
  });

  it("recognizes canonical keys", () => {
    for (const tier of CANONICAL_VEHICLE_TIERS) {
      expect(isCanonicalVehicleTier(tier)).toBe(true);
    }
    expect(isCanonicalVehicleTier("luxury-suv")).toBe(false);
  });

  it("rejects unknown keys with a named validation error", () => {
    expect(() => normalizeVehicleTier("luxury-suv")).toThrowError(
      UnknownVehicleTierError,
    );
    try {
      normalizeVehicleTier("innova_crysta");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(UnknownVehicleTierError);
      expect((error as UnknownVehicleTierError).code).toBe("VALIDATION_ERROR");
      expect((error as UnknownVehicleTierError).message).toContain(
        'Unknown vehicle tier "innova_crysta"',
      );
    }
  });

  it("normalizes legacy keys once, on the read path only", () => {
    expect(isLegacyVehicleTier("innova")).toBe(true);
    expect(isLegacyVehicleTier("tempo")).toBe(true);
    expect(normalizeVehicleTier("innova")).toBe("innova-crysta");
    expect(normalizeVehicleTier("tempo")).toBe("tempo-traveller");
    expect(normalizeVehicleTier("sedan")).toBe("sedan");
    expect(Object.keys(LEGACY_VEHICLE_TIER_MAP).sort()).toEqual([
      "innova",
      "tempo",
    ]);
  });

  it("never accepts legacy keys in new fleet-price records", () => {
    expect(() =>
      assertCanonicalFleetPrices({ innova: 1000 }),
    ).toThrowError(UnknownVehicleTierError);
    expect(() => assertCanonicalFleetPrices({ tempo: 2000 })).toThrowError(
      UnknownVehicleTierError,
    );
    expect(() =>
      assertCanonicalFleetPrices({ sedan: 1000, ertiga: 1500 }),
    ).not.toThrow();
  });
});
