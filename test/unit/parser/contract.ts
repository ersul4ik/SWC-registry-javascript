const assert = require("assert");
const expect = require("expect");

import Contract from "../../../src/core/declarations/contract";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

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
        const contracts: Contract[] = sol_file.parseContracts();
        //  NodeUtility.printNode(sol_file);
        expect(contracts[0].name).toEqual("A");
        expect(contracts[0].kind).toEqual("contract");
    });
});
