import SolidityAntlr from "../../../src/parser/solidity_antlr";
import Solc from "../../../src/parser/solc";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

import path from "path";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const error = "./test/sol_files/errors/error.sol";

describe(`Compile invalid SolFile ${error}`, () => {
    niv.install("solc@0.4.24", { quiet: true });

    it(`For Solc AST`, async () => {
        const out = Solc.compile(error, "0.4.24");
        expect(out.contracts).toEqual({});
        expect(out.errors.length).toEqual(1);
    });

    it(`For Antlr AST`, async () => {
        const out = SolidityAntlr.generateAST(error);
        expect(out.errors.length).toEqual(1);
    });
});
