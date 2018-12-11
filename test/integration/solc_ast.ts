import SolcUtility from "../../src/utils/solc";
import Solc from "../../src/parser/solc";
import SolidityAntlr from "../../src/parser/solidity_antlr";
const expect = require("expect");

describe("Solc AST walk", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";

    it(`Print all nodes for ${file_name}`, async () => {
        const antlr_ast = SolidityAntlr.generateAST(file_name);
        const imports = SolidityAntlr.parseAllImports(file_name, antlr_ast);
        const nodes = Solc.walkAST(file_name, SolidityAntlr.getPragmaVersion(antlr_ast), imports);
        for (const n of nodes) {
            if (n.name.match(/PragmaDirective/)) {
                console.log(n.attributes.literals);
                console.log(n.src);
                console.log(n.id);
                console.log(n.scope);
            }
        }
    });
});
