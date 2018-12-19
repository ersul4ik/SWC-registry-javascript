const assert = require("assert");
const expect = require("expect");

import CFunction from "../../../src/core/declarations/function";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import NodeTypes from "../../../src/maru/node_types";

describe("Solfile", () => {
    const file_name1 = "./test/sol_files/functions/functions.sol";
    const sol_file1 = new SolFile(file_name1);

    it(`Test case - variable tokenAddress has no parent ParameterList in ${file_name1}`, async () => {
        expect(sol_file1.contracts_current[1].functions[3].name).toEqual("isTokenTransferOK");
        expect(sol_file1.contracts_current[1].functions[3].variables[3].name).toEqual("tokenAddress");
        expect(sol_file1.hasParent(sol_file1.contracts_current[1].functions[3].variables[3].location.id, NodeTypes.ParameterList)).toEqual(
            false
        );
    });

    it(`Test case - variable tokenAddress has the following parents in ${file_name1}`, async () => {
        const parents: any[] = sol_file1.getParents(sol_file1.contracts_current[1].functions[3].variables[3].location.id);

        expect(parents[0].name).toEqual("VariableDeclarationStatement");
        expect(parents[1].name).toEqual("Block");
        expect(parents[2].name).toEqual("FunctionDefinition");
        expect(parents[3].name).toEqual("ContractDefinition");
        expect(parents[4].name).toEqual("SourceUnit");
    });

    const file_name2 = "./test/sol_files/variable/statements.sol";
    const sol_file2 = new SolFile(file_name2);

    it(`Test case - Contract variable t has the following children in ${file_name1}`, async () => {
        const children = sol_file2.getChildren(4);

        expect(children.length).toEqual(2);

        expect(children[0].name).toEqual(NodeTypes.ElementaryTypeName);
        expect(children[1].name).toEqual(NodeTypes.Literal);
    });

    it(`Test case - Contract variable t has the following children of ElementaryTypeName in ${file_name1}`, async () => {
        const children = sol_file2.getChildren(4, NodeTypes.ElementaryTypeName);

        expect(children.length).toEqual(1);

        expect(children[0].name).toEqual(NodeTypes.ElementaryTypeName);
    });

    it(`Test case - Node Elements in ${file_name1}`, async () => {
        const number = sol_file2.nodes.length;

        expect(number).toEqual(95);
    });
});
