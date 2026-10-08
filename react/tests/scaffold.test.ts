/**
 * Scaffold smoke test. Boundary: Customer workspace.
 * Real resolver/template/build tests are added with each feature phase
 * (Rules.md §9).
 */
import { describe, expect, it } from "vitest";
import { CUSTOMER_SCAFFOLD_MARKER } from "../src/index.js";

describe("customer scaffold", () => {
  it("exposes the scaffold marker", () => {
    expect(CUSTOMER_SCAFFOLD_MARKER).toBe("skb-customer-scaffold");
  });
});
