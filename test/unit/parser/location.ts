const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/core/declarations/contract";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

describe("Location", () => {
    const file_name1 = "./test/sol_files/pragma/simple_unformatted_pragma.sol";

    it(`Test case - pragma location in ${file_name1}`, async () => {
        const sol_file = new SolFile(file_name1);
        const pragmas = sol_file.sources[0].pragmas;
        expect(pragmas[0].location.id).toEqual(1);
        expect(pragmas[0].location.file_name).toEqual("./test/sol_files/pragma/simple_unformatted_pragma.sol");
        expect(pragmas[0].location.src).toEqual("11:24:0");
        expect(pragmas[0].location.lineNumberStart).toEqual(2);
        expect(pragmas[0].location.lineNumberEnd).toEqual(2);
        expect(pragmas[0].location.columnStart).toEqual(5);
        expect(pragmas[0].location.columnEnd).toEqual(29);
    });

    const file_name2 = "./test/sol_files/contracts/simple.sol";

    it(`Test case - pragma location in ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const pragmas = sol_file.sources[0].pragmas;
        expect(pragmas[0].location.id).toEqual(1);
        expect(pragmas[0].location.file_name).toEqual("./test/sol_files/contracts/simple.sol");
        expect(pragmas[0].location.src).toEqual("0:24:0");
        expect(pragmas[0].location.lineNumberStart).toEqual(1);
        expect(pragmas[0].location.lineNumberEnd).toEqual(1);
        expect(pragmas[0].location.columnStart).toEqual(0);
        expect(pragmas[0].location.columnEnd).toEqual(24);
    });

    it(`Test case - contract location in ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const contract = sol_file.contracts[0];
        expect(contract.location.id).toEqual(6);
        expect(contract.location.src).toEqual("26:55:0");
        expect(contract.location.lineNumberStart).toEqual(3);
        expect(contract.location.lineNumberEnd).toEqual(8);
        expect(contract.location.columnStart).toEqual(0);
        expect(contract.location.columnEnd).toEqual(1);
    });

    const file_name3 = "./test/sol_files/imports/simple.sol";

    it(`Test case - pragma location in import in ${file_name3}`, async () => {
        const sol_file = new SolFile(file_name3);
        const pragmas_1 = sol_file.sources[1].pragmas;
        const pragmas_2 = sol_file.sources[0].pragmas;

        expect(pragmas_1[0].location.id).toEqual(1);
        expect(pragmas_1[0].location.file_name).toEqual("./test/sol_files/imports/simple.sol");
        expect(pragmas_1[0].location.src).toEqual("0:23:1");
        expect(pragmas_1[0].location.lineNumberStart).toEqual(1);
        expect(pragmas_1[0].location.lineNumberEnd).toEqual(1);
        expect(pragmas_1[0].location.columnStart).toEqual(0);
        expect(pragmas_1[0].location.columnEnd).toEqual(23);

        expect(pragmas_2[0].location.id).toEqual(8);
        expect(pragmas_2[0].location.file_name).toEqual("./test/sol_files/imports/lib/E.sol");
        expect(pragmas_2[0].location.src).toEqual("0:23:0");
        expect(pragmas_2[0].location.lineNumberStart).toEqual(1);
        expect(pragmas_2[0].location.lineNumberEnd).toEqual(1);
        expect(pragmas_2[0].location.columnStart).toEqual(0);
        expect(pragmas_2[0].location.columnEnd).toEqual(23);
    });
});
