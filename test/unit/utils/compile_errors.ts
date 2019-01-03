import SolidityAntlr from "../../../src/parser/solidity_antlr";
import Solc from "../../../src/parser/solc";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

import path from "path";

const expect = require("expect");

const error = "./test/sol_files/errors/error.sol";
const warning = "./test/sol_files/errors/warning.sol";

describe(`Compile invalid SolFile ${error}`, () => {
    it(`Get errors for Solc and Antlr `, async () => {
        const sol_file = new SolFile(error);
        const errors = sol_file.getErrors();
        expect(errors.length).toEqual(2);
    });
});

describe(`Compile SolFile ${warning} with warnings`, () => {
    it(`Get warnings for Solc`, async () => {
        const sol_file = new SolFile(warning);
        const warnings = sol_file.getWarnings();
        expect(warnings.length).toEqual(2);
    });
});
