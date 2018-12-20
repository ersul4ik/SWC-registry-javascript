const assert = require("assert");
const expect = require("expect");

import SolFile from "../../../src/maru/sol_file";
import Pragma from "../../../src/core/declarations/pragma";

describe("Pragma", () => {
    const file_name1 = "./test/sol_files/pragma/simple_nopragma.sol";

    it(`Test case - No pragma set in file ${file_name1}`, async () => {
        const sol_file = new SolFile(file_name1);
        const pragmas: Pragma[] = sol_file.sources[0].parsePragma();
        expect(pragmas.length).toEqual(0);
    });

    const file_name2 = "./test/sol_files/pragma/simple_unformatted_pragma.sol";
    it(`Test case - Parse pragma in ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const pragmas: Pragma[] = sol_file.sources[0].parsePragma();
        expect(pragmas.length).toEqual(1);
    });
});
