const assert = require("assert");
const expect = require("expect");

import FunctionCall from "../../../src/expressions/function_call";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import CFunction from "../../../src/declarations/function";
import NodeUtility from "../../../src/utils/node";

describe("Function call parsing ", () => {
    const file_name = "./test/sol_files/function_calls/any.sol";
    const sol_file = new SolFile(file_name);

    sol_file.getInternalReferencedNodes();

    it(`Test case - should parse function calls in ${file_name}`, async () => {
        const cfunctions: CFunction[] = sol_file.parseFunction();

        let fcs: FunctionCall[] = sol_file.parseFunctionCalls(cfunctions[1].location.id);
        for (const f of fcs) {
            //   NodeUtility.printNode(f);
        }

        //       expect(fcs[0].name).toEqual("super.addOne");
        //       expect(fcs[1].name).toEqual("block.blockhash");
        //     expect(fcs[2].name).toEqual("blockhash");
    });
});
