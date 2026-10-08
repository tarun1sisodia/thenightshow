/**
 * Contract tests for money unit conversion.
 * Boundary: payment/database (integer paise) vs API/display (rupees).
 * Evidence: exact conversions, rejection of sub-paise precision and
 * non-integer minor units (Rules.md §3).
 */
import { describe, expect, it } from "vitest";
import {
  PAISE_PER_RUPEE,
  isMinorUnitAmount,
  toPaise,
  toRupees,
} from "../money.js";

describe("money units", () => {
  it("uses 100 paise per rupee", () => {
    expect(PAISE_PER_RUPEE).toBe(100);
  });

  it("converts rupees to integer paise", () => {
    expect(toPaise(1)).toBe(100);
    expect(toPaise(1.5)).toBe(150);
    expect(toPaise(0.01)).toBe(1);
    expect(toPaise(12345.67)).toBe(1234567);
  });

  it("converts paise back to rupees", () => {
    expect(toRupees(100)).toBe(1);
    expect(toRupees(150)).toBe(1.5);
    expect(toRupees(1234567)).toBe(12345.67);
  });

  it("round-trips without drift", () => {
    expect(toRupees(toPaise(999.99))).toBe(999.99);
  });

  it("rejects sub-paise precision instead of silently rounding money", () => {
    expect(() => toPaise(1.234)).toThrowError(/sub-paise/);
  });

  it("rejects non-finite rupees input", () => {
    expect(() => toPaise(Number.NaN)).toThrowError();
    expect(() => toPaise(Number.POSITIVE_INFINITY)).toThrowError();
  });

  it("only accepts non-negative integer minor units", () => {
    expect(isMinorUnitAmount(0)).toBe(true);
    expect(isMinorUnitAmount(150)).toBe(true);
    expect(isMinorUnitAmount(1.5)).toBe(false);
    expect(isMinorUnitAmount(-1)).toBe(false);
    expect(() => toRupees(1.5)).toThrowError();
    expect(() => toRupees(-100)).toThrowError();
  });
});
