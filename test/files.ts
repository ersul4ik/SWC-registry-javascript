const assert = require("assert");
import FileUtils from "../src/file_utils";

describe("Search for files", () => {
  describe("with .sol extension in ./test/", () => {
    it("should return more than 0 files", () => {
      const files = FileUtils.searchRecursive("./test/", ".sol");
      assert(files.length > 0);
    });
  });
});
