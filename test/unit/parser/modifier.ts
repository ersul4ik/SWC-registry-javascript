const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Modifier from "../../../src/core/declarations/modifier";

describe("Modifier", () => {
    const file_name = "./test/sol_files/conditional/proxy.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: parse modifiers operators in ${file_name}`, async () => {
        const contracts: Contract[] = sol_file.contracts_current;

        const modifiers: Modifier[] = sol_file.parseModifier();

        expect(modifiers.length).toEqual(2);

        expect(modifiers[0].name).toEqual("onlyOwner");
        expect(modifiers[0].scope).toEqual(107);
        expect(modifiers[0].visibility).toEqual("internal");
        expect(modifiers[0].variables.length).toEqual(1);
        expect(modifiers[0].variables[0].name).toEqual("i");
        expect(modifiers[0].function_parameters.length).toEqual(1);
        expect(modifiers[0].function_parameters[0].name).toEqual("i");
    });
});
