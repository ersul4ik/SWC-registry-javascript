import Solc from "../../src/parser/solc";
import NodeTypes from "../../src/maru/node_types";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const detectInstalled = require("detect-installed");
const no_imports_04 = "./test/sol_files/compile/simple.sol";
const imports_04 = "./test/sol_files/imports/A.sol";
const no_imports_05 = "./test/sol_files/contracts/simple_v051.sol";
const imports_05 = "./test/sol_files/imports/simple.sol";

let version_04 = "0.4.";

describe(`Compile ${no_imports_04} in any available version of 0.4.x`, () => {
    for (let x = 1; x <= 25; x++) {
        let current_version = version_04 + x.toString();

        it(`Compiling with ${current_version}`, async () => {
            let solc_compilation_output = Solc.compile(no_imports_04, current_version);

            let sources = Solc.walkAST(solc_compilation_output, current_version);

            expect(sources.length).toEqual(1);
            expect(sources[0].file_name).toEqual(no_imports_04);
            expect(sources[0].nodes.length).toEqual(11);
            expect(sources[0].nodes[0].name).toEqual(NodeTypes.SourceUnit);
        });
    }
});
