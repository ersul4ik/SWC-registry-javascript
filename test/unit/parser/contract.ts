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
        expect(contracts[0].name).toEqual("Simple");
        expect(contracts[0].kind).toEqual("contract");
    });

    const file_name2 = "./test/sol_files/contracts/storage.sol";

    it(`Test case - parse contract attibutes in  ${file_name2}`, async () => {
        const sol_file = new SolFile(file_name2);
        const contracts: Contract[] = sol_file.parseContracts();
        expect(contracts[0].name).toEqual("TestStorage");
        expect(contracts[0].kind).toEqual("contract");
    });

    const file_name3 = "./test/sol_files/contracts/simple_v051.sol";

    it(`Test case - parse contract attibutes in  ${file_name3}`, async () => {
        const sol_file = new SolFile(file_name3);
        //  StringUtility.printNode(sol_file.nodes);
    });
});
