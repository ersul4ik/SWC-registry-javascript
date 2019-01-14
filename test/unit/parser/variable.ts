const assert = require("assert");
const expect = require("expect");

import Variable from "../../../src/core/declarations/variable";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";
import Solc from "../../../src/parser/solc";
import NodeTypes from "../../../src/maru/node_types";
import CFunction from "../../../src/core/declarations/function";

describe("Variables", () => {
    const file_name1 = "./test/sol_files/variable/statements.sol";
    const sol_file1 = new SolFile(file_name1);
    const variables_c: Variable[] = sol_file1.contracts[0].state_variables;
    const variables_f: Variable[] = sol_file1.contracts[0].functions[0].variables;

    it(`Test case - get correct number of variables for function lol() in ${file_name1}`, async () => {
        expect(variables_f.length).toEqual(8);
    });

    it(`Test case - get attributes for variable r in function lol() in ${file_name1}`, async () => {
        const var_r: Variable = variables_f[0];
        expect(var_r.isConstant).toEqual(false);
        expect(var_r.isStateVar).toEqual(false);
        expect(var_r.name).toEqual("r");
        expect(var_r.scope).toEqual(76);
        expect(var_r.storageLocation).toEqual("default");
        expect(var_r.visibility).toEqual("internal");
    });

    it(`Test case - get attributes for variable gamesplayed in function lol() in ${file_name1}`, async () => {
        const gamesPlayed: Variable = variables_f[2];
        expect(gamesPlayed.isConstant).toEqual(false);
        expect(gamesPlayed.isStateVar).toEqual(false);
        expect(gamesPlayed.name).toEqual("gamesPlayed");
        expect(gamesPlayed.scope).toEqual(76);
        expect(gamesPlayed.storageLocation).toEqual("default");
        expect(gamesPlayed.visibility).toEqual("internal");
    });

    it(`Test case - get correct number of variables in contract TestStorage in ${file_name1}`, async () => {
        expect(variables_c.length).toEqual(2);
    });

    it(`Test case - get attributes for variable t in contract TestStorage  in ${file_name1}`, async () => {
        const var_t: Variable = variables_c[0];
        expect(var_t.isConstant).toEqual(false);
        expect(var_t.isStateVar).toEqual(true);
        expect(var_t.name).toEqual("t");
        expect(var_t.scope).toEqual(96);
        expect(var_t.storageLocation).toEqual("default");
        expect(var_t.visibility).toEqual("internal");
    });

    const file_name2 = "./test/sol_files/variable/FunctionTypes.sol";
    const sol_file2 = new SolFile(file_name2);

    it(`Test case - get attributes for variable t in contract TestStorage  in ${file_name2}`, async () => {
        const functions: CFunction[] = sol_file2.contracts[0].functions;
    });
});
