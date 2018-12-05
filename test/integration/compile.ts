import AstUtility from "../../src/utils/ast";

const expect = require("expect");
const remixLib = require('remix-lib')
var fs = require('fs')

const niv = require('npm-install-version')
niv.install('solc@0.4.24')
const compiler = niv.require('solc@0.4.24')

let input = {
    language: 'Solidity',
    sources: {},
    settings: {
        outputSelection: {
            '*': {
                '': ['ast']
            }
        }
    }
}

describe("Compile Sol File", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";

    it(`Extract sources from Solc AST for ${file_name}`, async () => {
        var content = fs.readFileSync(file_name, 'utf8')

        input.sources = { [file_name]: { content: content } }

        const out = JSON.parse(compiler.compileStandardWrapper(JSON.stringify(input)));

        expect(Object.keys(out.sources)[0]).toEqual(file_name);

        //  AstUtility.printNode(out)
    });

});
