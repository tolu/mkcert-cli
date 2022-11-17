import { assert, describe, it } from "vitest";
import { semverGreaterThan } from "../src/utils.js";

describe("semverGreaterThan", () => {
  it("returns expected bool", () => {
    assert.ok(semverGreaterThan("v1.4.4", "v.1.4.3"));
    assert.notOk(semverGreaterThan("v1.4.3", "v.1.4.4"));
    assert.notOk(semverGreaterThan("v1.4.4", "v1.4.4"));
  });
});
