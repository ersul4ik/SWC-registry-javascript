import AstUtility from "../../src/utils/ast";

const expect = require("expect");
const remixLib = require('remix-lib')
var fs = require('fs')

const compilerInput = remixLib.helpers.compiler.compilerInput

const niv = require('npm-install-version')
niv.install('solc@0.4.24')
var compiler = niv.require('solc@0.4.24')

describe("Compile Sol File", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";

    it(`Extract sources from Solc AST for ${file_name}`, async () => {
        var content = fs.readFileSync(file_name, 'utf8')
        const out = JSON.parse(compiler.compileStandardWrapper(compilerInput(content)));

        expect(Object.keys(out.sources)[0]).toEqual("test.sol");

        AstUtility.printNode(out)
    });

});
