const assert = require("assert");
const expect = require("expect");

import Variable from "../../../src/declarations/variable";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Solc from "../../../src/parser/solc";
import NodeTypes from "../../../src/maru/node_types";

describe("Variables", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case - should have the correct number of variables in ${file_name}`, async () => {
        const functions = sol_file.contracts_current[0].functions;

        console.log(functions[0].name);
        console.log(functions[0].location.id);

        const nodes = Solc.getNodeOfType(sol_file.nodes, NodeTypes.FunctionDefinition, functions[0].location.id);

        for (const n of nodes) {
            NodeUtility.printNode(n);
        }
    });
    /*
    it(`Test case - should have the correct attributes for UserDefinedType variable in ${file_name}`, async () => {
        let gamePlayed: any = vars.find(item => item.name === "gamePlayed");

        expect(gamePlayed.type.constructor.name).toEqual("UserDefinedType");
        expect(gamePlayed.initialValue).toEqual(null);
        expect(gamePlayed.storageLocation).toEqual(null);
        expect(gamePlayed.isStateVar).toEqual(false);
    });

    it(`Test case - should have the correct attributes for dynamic array variable abc in ${file_name}`, async () => {
        let abc: any = vars.find(item => item.name === "abc");

        expect(abc.type.constructor.name).toEqual("ArrayType");
        expect(abc.visibility).toEqual("default");
        expect(abc.isStateVar).toEqual(true);
    });

    */
});
