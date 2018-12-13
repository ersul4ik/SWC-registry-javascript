const assert = require("assert");
const expect = require("expect");

import Variable from "../../../src/declarations/variable";
import SolFile from "../../../src/maru/sol_file";
import Solc from "../../../src/parser/solc";
import NodeUtility from "../../../src/utils/node";

describe("Solc Utility", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - get correct number of children nodes of a function parameter in ${file_name}`, async () => {
        const nodes: any[] = Solc.getChildrenNodes(sol_file.nodes, 15);

        expect(nodes.length).toEqual(3);
    });
});
