const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/declarations/contract";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

describe("Location", () => {
    const file_name1 = "./test/sol_files/pragma/simple_unformatted_pragma.sol";

    it(`Test case - pragma location in  ${file_name1}`, async () => {
        const sol_file = new SolFile(file_name1);
        const pragmas = sol_file.pragmas;
        expect(pragmas[0].location.id).toEqual(1);
        expect(pragmas[0].location.src).toEqual("11:24:0");
        expect(pragmas[0].location.lineNumberStart).toEqual(2);
        expect(pragmas[0].location.lineNumberEnd).toEqual(2);
        expect(pragmas[0].location.columnStart).toEqual(5);
        expect(pragmas[0].location.columnEnd).toEqual(29);
    });

    const file_name2 = "./test/sol_files/contracts/simple.sol";

    it(`Test case - pragma location in  ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const pragmas = sol_file.pragmas;
        expect(pragmas[0].location.id).toEqual(1);
        expect(pragmas[0].location.src).toEqual("0:24:0");
        expect(pragmas[0].location.lineNumberStart).toEqual(1);
        expect(pragmas[0].location.lineNumberEnd).toEqual(1);
        expect(pragmas[0].location.columnStart).toEqual(0);
        expect(pragmas[0].location.columnEnd).toEqual(24);
    });

    it(`Test case - contract location in  ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const contract = sol_file.contracts_current[0];
        expect(contract.location.id).toEqual(6);
        expect(contract.location.src).toEqual("26:55:0");
        expect(contract.location.lineNumberStart).toEqual(3);
        expect(contract.location.lineNumberEnd).toEqual(8);
        expect(contract.location.columnStart).toEqual(0);
        expect(contract.location.columnEnd).toEqual(1);
    });
});
