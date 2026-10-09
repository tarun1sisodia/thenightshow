/**
 * Contract tests for the API response envelope.
 * Boundary: every API boundary in Backend, consumed by Admin and Customer.
 * Evidence: exactly two shapes; failure carries code/message/fields/requestId
 * (Architecture.md §6.3).
 */
import { describe, expect, it } from "vitest";
import {
  fail,
  isApiFailure,
  isApiSuccess,
  ok,
  type ApiResponse,
} from "../wire.js";
import { createRequestId } from "../ids.js";

describe("API envelope", () => {
  it("builds the success envelope", () => {
    const requestId = createRequestId();
    const response = ok({ slug: "agra-jaipur" }, requestId);
    expect(response).toEqual({
      success: true,
      data: { slug: "agra-jaipur" },
      requestId,
    });
    expect(isApiSuccess(response)).toBe(true);
    expect(isApiFailure(response)).toBe(false);
  });

  it("builds the failure envelope with field-level errors", () => {
    const requestId = createRequestId();
    const response = fail(
      "VALIDATION_ERROR",
      "Fare is required for every available fleet",
      requestId,
      { "faresInr.sedan": "Required" },
    );
    expect(response.success).toBe(false);
    expect(isApiFailure(response)).toBe(true);
    if (isApiFailure(response)) {
      expect(response.error.code).toBe("VALIDATION_ERROR");
      expect(response.error.message).toContain("Fare is required");
      expect(response.error.fields).toEqual({ "faresInr.sedan": "Required" });
      expect(response.error.requestId).toBe(requestId);
    }
  });

  it("omits fields when there are no field-level errors", () => {
    const response = fail("NOT_FOUND", "Route not found", createRequestId());
    expect(isApiFailure(response)).toBe(true);
    if (isApiFailure(response)) {
      expect(response.error.fields).toBeUndefined();
      expect("fields" in response.error).toBe(false);
    }
  });

  it("type guard accepts any ApiResponse without a third shape", () => {
    const responses: ApiResponse<unknown>[] = [
      ok(null, createRequestId()),
      fail("INTERNAL_ERROR", "boom", createRequestId()),
    ];
    for (const response of responses) {
      expect(response.success === true || response.success === false).toBe(true);
    }
  });
});
