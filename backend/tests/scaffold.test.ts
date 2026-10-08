/**
 * Scaffold smoke test. Boundary: Backend workspace.
 * Real module tests are added with each feature phase (Rules.md §9).
 */
import { describe, expect, it } from "vitest";
import { BACKEND_SCAFFOLD_MARKER } from "../src/index.js";

describe("backend scaffold", () => {
  it("exposes the scaffold marker", () => {
    expect(BACKEND_SCAFFOLD_MARKER).toBe("skb-backend-scaffold");
  });
});
