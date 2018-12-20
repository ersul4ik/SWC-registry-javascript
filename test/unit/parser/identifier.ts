const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Identifier from "../../../src/core/expressions/identifier";
import CFunction from "../../../src/core/declarations/function";

describe("Identifier", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: identifiers in function lol() of ${file_name}`, async () => {
        const functions: CFunction[] = sol_file.contracts[0].functions;

        const identifiers: Identifier[] = sol_file.sources[0].parseIdentifiers(functions[0].location.id);

        expect(identifiers.length).toEqual(6);

        expect(identifiers[3].name).toEqual("sha3");
        expect(identifiers[3].referencedDeclaration).toEqual(121);

        expect(identifiers[4].name).toEqual("y");
        expect(identifiers[4].referencedDeclaration).toEqual(40);
    });
});
