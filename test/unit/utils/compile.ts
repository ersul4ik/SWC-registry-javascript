import SolidityAntlr from "../../../src/parser/solidity_antlr";
import Solc from "../../../src/parser/solc";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

import path from "path";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const detectInstalled = require("detect-installed");

describe("Compile Sol File without imports", () => {
    const file_name = "./test/sol_files/contracts/simple.sol";

    it(`Extract sources from Solc AST for ${file_name}`, async () => {
        const out = Solc.compile(file_name, "0.4.24", false);

        expect(Object.keys(out.sources)[0]).toEqual(file_name);

        //    AstUtility.printNode(out)
    });

    it(`Check if Solc version 0.4.24 is installed`, async () => {
        niv.install("solc@0.4.24", { quiet: true });

        const result = Solc.isSolcVersionInstalled("0.4.24");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(file_name);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.4.24");
    });
});

describe("Compile Sol File with imports - POC ", () => {
    const file_name = "./test/sol_files/imports/simple.sol";

    it(`Check if imports are compiled correctly for ${file_name}`, async () => {
        //const sol_file = new SolFile(file_name);
        // NodeUtility.printNode(sol_file.nodes);
        niv.install("solc@0.4.25", { quiet: true });
        const compiler = niv.require("solc@0.4.25");
        const CONTRACTS_DIR = path.resolve(__dirname, "../../sol_files/imports/");

        function findContract(pathName: any) {
            const contractPath = path.resolve(CONTRACTS_DIR, pathName);
            if (isContract(contractPath)) {
                return fs.readFileSync(contractPath, "utf8");
            } else {
                throw new Error(`File ${contractPath} not found`);
            }
        }

        function isContract(path: any) {
            return fs.existsSync(path);
        }
        function findImports(pathName: any) {
            try {
                return { contents: findContract(pathName) };
            } catch (e) {
                return { error: e.message };
            }
        }

        const source = findContract("A.sol");
        const compiled = compiler.compile(
            {
                sources: {
                    "A.sol": source
                }
            },
            1,
            findImports
        );
        // NodeUtility.printNode(compiled);
    });
});

describe("Compile Sol File with imports - POC ", () => {
    const file_name = "./test/sol_files/imports/A.sol";

    it(`Check if imports are compiled correctly for ${file_name}`, async () => {
        //const sol_file = new SolFile(file_name);
        // NodeUtility.printNode(sol_file.nodes);
        let sol_file: SolFile = new SolFile(file_name);
    });
});
