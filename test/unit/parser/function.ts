const assert = require("assert");
const expect = require("expect");

import CFunction from "../../../src/declarations/cfunction";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";

/*
describe("Function parsing", () => {
    const file_name = "./test/sol_files/functions/functions.sol";
    const sol_file = new SolFile(file_name);
    const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(sol_file.block);

    it(`Test case - should parse all function elements for ${file_name}`, async () => {
        expect(cfunctions.length).toEqual(8);

        expect(cfunctions[0].name).toEqual("constructor");
        expect(cfunctions[3].name).toEqual("constructor");

        expect(cfunctions[0].visibility).toEqual("public");
        expect(cfunctions[7].visibility).toEqual("default");

        expect(cfunctions[0].stateMutability).toEqual("nonpayable");
        expect(cfunctions[6].stateMutability).toEqual("view");
        expect(cfunctions[7].stateMutability).toEqual("payable");
    });

    it(`Test case - should parse all function parameters ${file_name}`, async () => {
        const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(sol_file.block);

        expect(cfunctions[0].function_parameters[0].name).toEqual("_name");
        expect(cfunctions[0].function_parameters[0].type.constructor.name).toEqual("ElementaryType");

        expect(cfunctions[5].function_parameters[1].name).toEqual("name");
        expect(cfunctions[5].function_parameters[1].type.constructor.name).toEqual("ElementaryType");
    });

    it(`Test case - should parse all function return parameters ${file_name}`, async () => {
        const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(sol_file.block);

        expect(cfunctions[4].returnParameters[0].name).toEqual("tokenAddress");
        expect(cfunctions[4].returnParameters[0].type.constructor.name).toEqual("UserDefinedType");

        expect(cfunctions[6].returnParameters[0].name).toEqual("ok");
        expect(cfunctions[6].returnParameters[0].type.constructor.name).toEqual("ElementaryType");
    });
});
*/
