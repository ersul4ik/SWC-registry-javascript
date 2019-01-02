import SolidityAntlr from "../../../src/parser/solidity_antlr";
import Solc from "../../../src/parser/solc";
import SolFile from "../../../src/maru/sol_file";
import NodeUtility from "../../../src/utils/node";

import path from "path";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const detectInstalled = require("detect-installed");
const no_imports_04 = "./test/sol_files/contracts/simple.sol";
const imports_04 = "./test/sol_files/imports/A.sol";
const no_imports_05 = "./test/sol_files/contracts/simple_v051.sol";
const imports_05 = "./test/sol_files/imports/simple.sol";

describe(`Compile Sol File without imports using version 0.4.x for ${no_imports_04}`, () => {
    niv.install("solc@0.4.24", { quiet: true });

    it(`Extract sources from Solc AST`, async () => {
        const out = Solc.compile(no_imports_04, "0.4.24");

        expect(Object.keys(out.sources)[0]).toEqual(no_imports_04);

        //    AstUtility.printNode(out)
    });

    it(`Check if Solc version 0.4.24 is installed`, async () => {
        const result = Solc.isSolcVersionInstalled("0.4.24");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(no_imports_04);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.4.24");
    });
});

describe(`Compile Sol File with imports using version 0.4.x for ${imports_04}`, () => {
    niv.install("solc@0.4.24", { quiet: true });

    it(`Extract sources from Solc AST`, async () => {
        const out = Solc.compile(imports_04, "0.4.24");
        expect(Object.keys(out.sources)[0]).toEqual(imports_04);
        expect(Object.keys(out.sources)[1]).toEqual("./test/sol_files/imports/lib/B.sol");
        expect(Object.keys(out.sources)[2]).toEqual("./test/sol_files/imports/lib2/C.sol");
        expect(Object.keys(out.sources)[3]).toEqual("./test/sol_files/imports/lib2/D.sol");
    });

    it(`Check if Solc version 0.4.24 is installed`, async () => {
        const result = Solc.isSolcVersionInstalled("0.4.24");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(imports_04);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.4.24");
    });
});

describe(`Compile Sol File without imports using version 0.5.x for ${no_imports_04}`, () => {
    niv.install("solc@0.5.1", { quiet: true });

    it(`Extract sources from Solc AST`, async () => {
        const out = Solc.compile(no_imports_05, "0.5.1");

        expect(Object.keys(out.sources)[0]).toEqual(no_imports_05);

        //    AstUtility.printNode(out)
    });

    it(`Check if Solc version 0.5.1 is installed`, async () => {
        const result = Solc.isSolcVersionInstalled("0.5.1");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(no_imports_05);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.5.1");
    });
});

describe(`Compile Sol File with imports using version 0.5.x for ${imports_05}`, () => {
    niv.install("solc@0.5.1", { quiet: true });

    it(`Extract sources from Solc AST`, async () => {
        const out = Solc.compile(imports_05, "0.5.1");

        expect(Object.keys(out.sources)[1]).toEqual(imports_05);
        expect(Object.keys(out.sources)[0]).toEqual("./test/sol_files/imports/lib/E.sol");
    });

    it(`Check if Solc version 0.5.1 is installed`, async () => {
        const result = Solc.isSolcVersionInstalled("0.5.1");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(imports_05);
        const result = SolidityAntlr.getPragmaVersion(antlr_ast);
        expect(result).toEqual("0.5.1");
    });
});

/*
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
*/
