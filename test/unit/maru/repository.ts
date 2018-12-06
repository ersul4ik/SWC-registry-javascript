const assert = require("assert");
const expect = require("expect");

import Repository from "../../../src/maru/repository";

describe("Repository", () => {
  describe("#addFiles recursively to a Repository", () => {
    it("should have more than 0 files in the sol  test directory", () => {
      const test = new Repository();
      test.addFiles("./test/sol_files", ".sol");

      expect(test.sol_files.length).toBeGreaterThan(0);
    });
  });
});
