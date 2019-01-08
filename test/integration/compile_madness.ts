import Solc from "../../src/parser/solc";
import NodeTypes from "../../src/maru/node_types";
import NodeUtility from "../../src/utils/node";
import Constants from "../../src/misc/constants";

const expect = require("expect");
const fs = require("fs");

const niv = require("npm-install-version");

const detectInstalled = require("detect-installed");
const no_imports_04 = "./test/sol_files/compile/simple_04.sol";
const imports_04 = "./test/sol_files/imports/A.sol";
const no_imports_05 = "./test/sol_files/compile/simple_05.sol";
const imports_05 = "./test/sol_files/imports/simple.sol";

describe(`Compile ${no_imports_04} in any available version of 0.4.x`, () => {
    for (const version of Constants.supported_solc_version_04) {
        it(`Compiling with ${version}`, async () => {
            let solc_compilation_output = Solc.compile(no_imports_04, version);

            let sources = Solc.walkAST(solc_compilation_output, version);

            expect(sources.length).toEqual(1);
            expect(sources[0].file_name).toEqual(no_imports_04);
            expect(sources[0].nodes.length).toEqual(11);
            expect(sources[0].nodes[0].name).toEqual(NodeTypes.SourceUnit);
        });
    }
});

describe(`Compile ${no_imports_05} in any available version of 0.5.x`, () => {
    for (const version of Constants.supported_solc_version_05) {
        it(`Compiling with ${version}`, async () => {
            let solc_compilation_output = Solc.compile(no_imports_05, version);

            let sources = Solc.walkAST(solc_compilation_output, version);

            expect(sources.length).toEqual(1);
            expect(sources[0].file_name).toEqual(no_imports_05);
            expect(sources[0].nodes.length).toEqual(11);
            expect(sources[0].nodes[0].name).toEqual(NodeTypes.SourceUnit);
        });
    }
});
