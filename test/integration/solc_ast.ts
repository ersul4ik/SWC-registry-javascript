import SolcUtility from "../../src/utils/solc";
import Solc from "../../src/parser/solc";
import StringUtility from "../../src/utils/ast";

const expect = require("expect");

describe("Solc AST walk", () => {
    const file_name = "./test/sol_files/unary/typo_one_command.sol";

    it(`Print all nodes for ${file_name}`, async () => {
        const nodes = Solc.walkAST(file_name);
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
