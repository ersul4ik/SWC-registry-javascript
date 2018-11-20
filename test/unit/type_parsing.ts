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
import ArrayType from '../../src/types/array_type';

describe("Type parsing for variables", () => {
  const file_name = "./test/sol_files/variable/statements.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should have parse all variable types correctly ${file_name}`, async () => {
    let state_var: Variable[] = SolidityAntlr.parseVariables(ast);

    for (const v of state_var) {
      if (v.type instanceof ArrayType) {
        console.log(v.name)
      }


    }

  });

});