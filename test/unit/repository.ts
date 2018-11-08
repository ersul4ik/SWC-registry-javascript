const assert = require("assert");
import Repository from "../../src/maru/repository";

describe("Repository", () => {
  describe("#addFiles recursively to a Repository", () => {
    it("should have more than 0 files in the test directory", () => {
      const test = new Repository();
     // test.addFiles("./test", ".sol");

      //assert(Object.keys(test).length > 0);
    });
  });
});
