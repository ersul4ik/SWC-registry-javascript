import { should } from 'should/should';
const assert = require("assert");
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import AstUtility from '../../src/utils/ast'
import CFunction from '../../src/declarations/cfunction';

describe("Function parsing simple", () => {
  const file_name = "./test/sol_files/functions/functions.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should have all expected function elements for ${file_name}`, async () => {
    const cfunctions: CFunction[] = SolidityAntlr.parseCFunction(ast);

    expect(cfunctions.length).toEqual(8);

    expect(cfunctions[0].name).toEqual("constructor");
    expect(cfunctions[3].name).toEqual("constructor");

    expect(cfunctions[0].visibility).toEqual("public");
    expect(cfunctions[7].visibility).toEqual("default");

    expect(cfunctions[0].stateMutability).toEqual("nonpayable");
    expect(cfunctions[6].stateMutability).toEqual("view");
    expect(cfunctions[7].stateMutability).toEqual("payable");

    for (const f of cfunctions) {
      AstUtility.printNode(f.name)
    }

  });

});
