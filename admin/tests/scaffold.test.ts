/**
 * Scaffold smoke test. Boundary: Admin workspace.
 * Real page/form tests are added with each feature phase (Rules.md §9).
 */
import { describe, expect, it } from "vitest";
import { ADMIN_SCAFFOLD_MARKER } from "../src/index.js";

describe("admin scaffold", () => {
  it("exposes the scaffold marker", () => {
    expect(ADMIN_SCAFFOLD_MARKER).toBe("skb-admin-scaffold");
  });
});
