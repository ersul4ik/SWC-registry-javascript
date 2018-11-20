import { should } from 'should/should';
const assert = require("assert");
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import CFunction from '../../src/declarations/cfunction';
import Variable from '../../src/declarations/variable';
import AstUtility from '../../src/utils/ast';

describe("Type parsing for variables", () => {
  const file_name = "./test/sol_files/variable/statements.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should have parse all variable types correctly ${file_name}`, async () => {
    let state_var: Variable[] = SolidityAntlr.parseVariables(ast);

    /*
    expect(cfunctions.length).toEqual(8);

    expect(cfunctions[0].name).toEqual("constructor");
    expect(cfunctions[3].name).toEqual("constructor");

    expect(cfunctions[0].visibility).toEqual("public");
    expect(cfunctions[7].visibility).toEqual("default");

    expect(cfunctions[0].stateMutability).toEqual("nonpayable");
    expect(cfunctions[6].stateMutability).toEqual("view");
    expect(cfunctions[7].stateMutability).toEqual("payable");
        console.log(state_var.length)
        */
    for (const v of state_var) {
      console.log(v.type.constructor.name)
      AstUtility.printNode(v.type)

    }

  });

});