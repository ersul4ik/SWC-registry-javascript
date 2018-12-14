const assert = require("assert");
const expect = require("expect");

import CFunction from "../../../src/declarations/function";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import NodeTypes from "../../../src/maru/node_types";

describe("Solfile", () => {
    const file_name = "./test/sol_files/functions/functions.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - variable tokenAddress has no parent ParameterList in ${file_name}`, async () => {
        expect(sol_file.contracts_current[1].functions[3].name).toEqual("isTokenTransferOK");
        expect(sol_file.contracts_current[1].functions[3].variables[3].name).toEqual("tokenAddress");
        expect(sol_file.hasParent(sol_file.contracts_current[1].functions[3].variables[3].location.id, NodeTypes.ParameterList)).toEqual(
            false
        );
    });

    it(`Test case - variable tokenAddress has the following parents in ${file_name}`, async () => {
        const parents: any[] = sol_file.getParents(sol_file.contracts_current[1].functions[3].variables[3].location.id);

        expect(parents[0].name).toEqual("VariableDeclarationStatement");
        expect(parents[1].name).toEqual("Block");
        expect(parents[2].name).toEqual("FunctionDefinition");
        expect(parents[3].name).toEqual("ContractDefinition");
        expect(parents[4].name).toEqual("SourceUnit");
    });
});
