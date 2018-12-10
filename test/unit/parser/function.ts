const assert = require("assert");
const expect = require("expect");

import CFunction from "../../../src/declarations/function";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";

describe("Function parsing", () => {
    const file_name = "./test/sol_files/functions/functions.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - should parse functions in contract OwnedToken in ${file_name}`, async () => {
        expect(sol_file.contracts_current[0].functions[0].name).toEqual("constructor");
        expect(sol_file.contracts_current[0].functions[0].isConstructor).toEqual(true);
        expect(sol_file.contracts_current[0].functions[0].isImplemented).toEqual(true);
        expect(sol_file.contracts_current[0].functions[0].visibility).toEqual("public");
        expect(sol_file.contracts_current[0].functions[0].stateMutability).toEqual("nonpayable");

        expect(sol_file.contracts_current[0].functions[1].name).toEqual("changeName");

        expect(sol_file.contracts_current[0].functions[2].name).toEqual("transfer");
    });

    it(`Test case - should functions in contract TokenCreator in ${file_name}`, async () => {
        expect(sol_file.contracts_current[1].functions.length).toEqual(5);

        expect(sol_file.contracts_current[1].functions[0].name).toEqual("constructor");

        expect(sol_file.contracts_current[1].functions[4].stateMutability).toEqual("payable");

        for (const n of sol_file.nodes) {
            console.log(n.id);
        }
    });
});
