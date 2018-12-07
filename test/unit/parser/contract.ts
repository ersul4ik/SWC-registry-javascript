const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/declarations/contract";
import SolFile from "../../../src/maru/sol_file";

describe("Contract parsing", () => {
    const file_name = "./test/sol_files/contracts/storage.sol";
    const sol_file = new SolFile(file_name);
    const contracts: Contract[] = sol_file.contracts_current;

    it(`Test case - should have expected contract elements for ${file_name}`, async () => {
        expect(contracts[0].name).toEqual("TestStorage");

        expect(contracts[0].kind).toEqual("contract");

        expect(contracts[0].baseContracts.length).toEqual(0);

        expect(contracts[0].subNodes.branch.length).toEqual(12);
    });

    it(`Test case - contract should have expected location information in ${file_name}`, async () => {
        expect(contracts[0].location.lineNumberStart).toEqual(3);
        expect(contracts[0].location.lineNumberEnd).toEqual(41);
        expect(contracts[0].location.columnStart).toEqual(0);
        expect(contracts[0].location.columnEnd).toEqual(0);
        expect(contracts[0].location.src).toEqual("26:1014:0");
    });

    it(`Test case - contract should have the right number of functions and variables in ${file_name}`, async () => {
        expect(contracts[0].subNodes.branch.length).toEqual(12);

        expect(contracts[0].functions.length).toEqual(1);

        expect(contracts[0].variables.length).toEqual(13);
    });
});
