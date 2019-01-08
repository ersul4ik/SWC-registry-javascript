const assert = require("assert");
const expect = require("expect");
const parser = require("solidity-parser-antlr");

import Contract from "../../../src/core/declarations/contract";
import BinaryOperation from "../../../src/core/expressions/binary_operation";
import SolFile from "../../../src/maru/sol_file";
import SolidityAntlr from "../../../src/parser/solidity_antlr";
import NodeUtility from "../../../src/utils/node";

describe("SourceUnit", () => {
    const file_name = "./test/sol_files/contracts/simple.sol";
    const sol_file = new SolFile(file_name);

    it(`Test case: find source unit in ${file_name}`, async () => {
        expect(sol_file.sources[0].source_unit[0].id).toEqual(7);
        //   expect(sol_file.sources[0].source_unit[0].absolutePath).toEqual("./test/sol_files/contracts/simple.sol");
    });
});
