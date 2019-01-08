const assert = require("assert");
import FileUtils from "../../../src/utils/file";

describe("Search for files", () => {
    describe("with .sol extension in ./test/", () => {
        it("should return more than 0 files", () => {
            const files = FileUtils.searchRecursive("./test/sol_files/", ".sol");
            assert(files.length > 0);
        });
    });
});
