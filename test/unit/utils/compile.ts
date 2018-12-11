import SolcUtility from "../../../src/utils/solc";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import Solc from "../../../src/parser/solc";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const compiler = niv.require("solc@0.4.24");
const detectInstalled = require("detect-installed");

describe("Compile Sol File without imports", () => {
    const file_name = "./test/sol_files/contracts/simple.sol";

    it(`Extract sources from Solc AST for ${file_name}`, async () => {
        const out = SolcUtility.compile(file_name, "0.4.24");

        expect(Object.keys(out.sources)[0]).toEqual(file_name);

        //    AstUtility.printNode(out)
    });

    it(`Check if Solc version 0.4.24 is installed`, async () => {
        niv.install("solc@0.4.24", { quiet: true });

        const result = SolcUtility.isSolcVersionInstalled("0.4.24");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(file_name);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.4.24");
    });
});

describe("Compile Sol File with imports", () => {
    const file_name = "./test/sol_files/imports/simple.sol";

    it(`Check if imports are compiled correctly for ${file_name}`, async () => {
        const sol_file = new SolFile(file_name);
        NodeUtility.printNode(sol_file.nodes);
    });
});
