import AstUtility from "../../src/utils/ast";
import SolcUtility from "../../src/utils/solc";

const expect = require("expect");
const fs = require('fs')

const niv = require('npm-install-version')

niv.install('solc@0.4.24')
const compiler = niv.require('solc@0.4.24')
const detectInstalled = require('detect-installed')

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

        const out = SolcUtility.compile(file_name);

        expect(Object.keys(out.sources)[0]).toEqual(file_name);

        // AstUtility.printNode(out)
    });

    it(`Check if Solc version 0.4.24 is installed`, async () => {
        niv.install('solc@0.4.24')

        const result = await SolcUtility.isSolcVersionInstalled("0.4.24");
        expect(result).toEqual(true);
    });

    it(`Extract pramga version from Sol file`, async () => {
        const file_name = "./test/sol_files/unary/typo_one_command.sol";

        const result = SolcUtility.getPragmaVersion(file_name)
        expect(result).toEqual("0.4.24");
    });
});
