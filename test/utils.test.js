import { assert, describe, it } from "vitest";
import { pkgVersion, semverGreaterThan } from "../src/utils.js";
//@ts-ignore - since only available from node 17
import pkgJson from '../package.json' assert { type: "json"};

describe("semverGreaterThan", () => {
  it("returns expected bool", () => {
    assert.ok(semverGreaterThan("v1.4.4", "v.1.4.3"));
    assert.notOk(semverGreaterThan("v1.4.3", "v.1.4.4"));
    assert.notOk(semverGreaterThan("v1.4.4", "v1.4.4"));
  });
});

describe('pkgJson', () => {
  it('matches asserted import value', () => {
    assert.equal(pkgVersion, `v${pkgJson.version}`);
  })
})
