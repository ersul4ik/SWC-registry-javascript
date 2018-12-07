const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/declarations/contract";
import SolFile from "../../../src/maru/sol_file";
import StringUtility from "../../../src/utils/ast";

describe("Contract", () => {
    const file_name1 = "./test/sol_files/contracts/simple.sol";

    it(`Test case - parse contract attibutes in  ${file_name1}`, async () => {
        const sol_file = new SolFile(file_name1);
        const contracts: Contract[] = sol_file.parseContracts();
        StringUtility.printNode(contracts);
    });

    const file_name2 = "./test/sol_files/contracts/storage.sol";

    it(`Test case - parse contract attibutes in  ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const contracts: Contract[] = sol_file.parseContracts();
        StringUtility.printNode(contracts);
    });

    const file_name3 = "./test/sol_files/contracts/simple2.sol";

    it(`Test case - parse contract attibutes in  ${file_name3}`, async () => {
        const sol_file = new SolFile(file_name3);
        StringUtility.printNode(sol_file.nodes);
    });
    /*
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
    });*/
});
