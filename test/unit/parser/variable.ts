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
    const variables: Variable[] = sol_file.contracts_current[0].functions[0].variables;

    it(`Test case - get correct number of variables for function lol() in ${file_name}`, async () => {
        expect(variables.length).toEqual(8);
    });

    it(`Test case - get attributes for variable r in function lol() in ${file_name}`, async () => {
        const var_r: Variable = variables[0];
        expect(var_r.isConstant).toEqual(false);
        expect(var_r.isStateVar).toEqual(false);
        expect(var_r.name).toEqual("r");
        expect(var_r.scope).toEqual(76);
        expect(var_r.storageLocation).toEqual("default");
        expect(var_r.type).toEqual("uint8");
        expect(var_r.visibility).toEqual("internal");
    });

    it(`Test case - get attributes for variable gamesplayed in function lol() in ${file_name}`, async () => {
        const var_r: Variable = variables[2];
        expect(var_r.isConstant).toEqual(false);
        expect(var_r.isStateVar).toEqual(false);
        expect(var_r.name).toEqual("gamesPlayed");
        expect(var_r.scope).toEqual(76);
        expect(var_r.storageLocation).toEqual("default");
        expect(var_r.type).toEqual("struct TestStorage.Game[]");
        expect(var_r.visibility).toEqual("internal");
    });
});
