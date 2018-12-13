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
    const variables_c: Variable[] = sol_file.contracts_current[0].variables;
    const variables_f: Variable[] = sol_file.contracts_current[0].functions[0].variables;

    it(`Test case - get correct number of variables for function lol() in ${file_name}`, async () => {
        expect(variables_f.length).toEqual(8);
    });

    it(`Test case - get attributes for variable r in function lol() in ${file_name}`, async () => {
        const var_r: Variable = variables_f[0];
        expect(var_r.isConstant).toEqual(false);
        expect(var_r.isStateVar).toEqual(false);
        expect(var_r.name).toEqual("r");
        expect(var_r.scope).toEqual(76);
        expect(var_r.storageLocation).toEqual("default");
        expect(var_r.type).toEqual("uint8");
        expect(var_r.visibility).toEqual("internal");
    });

    it(`Test case - get attributes for variable gamesplayed in function lol() in ${file_name}`, async () => {
        const gamesPlayed: Variable = variables_f[2];
        expect(gamesPlayed.isConstant).toEqual(false);
        expect(gamesPlayed.isStateVar).toEqual(false);
        expect(gamesPlayed.name).toEqual("gamesPlayed");
        expect(gamesPlayed.scope).toEqual(76);
        expect(gamesPlayed.storageLocation).toEqual("default");
        expect(gamesPlayed.type).toEqual("struct TestStorage.Game[]");
        expect(gamesPlayed.visibility).toEqual("internal");
    });

    it(`Test case - get correct number of variables in contract TestStorage in ${file_name}`, async () => {
        expect(variables_c.length).toEqual(2);
    });

    it(`Test case - get attributes for variable t in contract TestStorage  in ${file_name}`, async () => {
        const var_t: Variable = variables_c[0];
        expect(var_t.isConstant).toEqual(false);
        expect(var_t.isStateVar).toEqual(true);
        expect(var_t.name).toEqual("t");
        expect(var_t.scope).toEqual(96);
        expect(var_t.storageLocation).toEqual("default");
        expect(var_t.type).toEqual("uint256");
        expect(var_t.visibility).toEqual("internal");
    });
});
