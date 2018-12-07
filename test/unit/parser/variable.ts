const assert = require("assert");
const expect = require("expect");

import Variable from "../../../src/declarations/variable";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";

describe("Variable parsing simple", () => {
    const file_name = "./test/sol_files/variable/statements.sol";
    const sol_file = new SolFile(file_name);
    let vars: Variable[] = SolidityAntlr.parseVariables(sol_file.block);

    it(`Test case - should have the correct number of variables in ${file_name}`, async () => {
        expect(vars.length).toEqual(10);
    });

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
});
