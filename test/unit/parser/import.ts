const assert = require("assert");
const expect = require("expect");

import Import from "../../../src/core/declarations/import";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import SolFile from "../../../src/maru/sol_file";

describe("Imports", () => {
    const file_name = "./test/sol_files/imports/A.sol";
    const sol_file: SolFile = new SolFile(file_name);

    it(`Test case - should contain all imports for ${file_name}`, async () => {
        expect(sol_file.sources.length).toEqual(4);
    });

    it(`Test case - should list all expected imports for ${file_name} and any other imports`, async () => {
        expect(sol_file.sources[0].file_name).toEqual("./test/sol_files/imports/A.sol");
        expect(sol_file.sources[1].file_name).toEqual("./test/sol_files/imports/lib/B.sol");
        expect(sol_file.sources[2].file_name).toEqual("./test/sol_files/imports/lib2/C.sol");
        expect(sol_file.sources[3].file_name).toEqual("./test/sol_files/imports/lib2/D.sol");
    });
});
