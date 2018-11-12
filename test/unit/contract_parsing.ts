import { should } from 'should/should';
const assert = require("assert");
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import AstUtility from '../../src/utils/ast'

describe("Contract parsing simple", () => {
  const file_name = "./test/sol_files/contracts/simple.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should have all expected contract elements for ${file_name}`, async () => {
    const contracts: Contract[] = SolidityAntlr.parseContracts(ast);

    expect(contracts[0].name).toEqual("TestStorage");

    expect(contracts[0].kind).toEqual("contract");

    expect(contracts[0].baseContracts.length).toEqual(0);

    expect(contracts[0].subNodes.branch.length).toEqual(12);

    expect(contracts[0].location.lineNumberStart).toEqual(3);
    expect(contracts[0].location.lineNumberEnd).toEqual(41);
    expect(contracts[0].location.columnStart).toEqual(0);
    expect(contracts[0].location.columnEnd).toEqual(0);
    expect(contracts[0].location.src).toEqual("26:1014:0");

    for (const contract of contracts) {
      AstUtility.printNode(contract.functions)
    }
  });

});
