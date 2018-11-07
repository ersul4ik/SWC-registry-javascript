import {should} from 'should/should';
const assert = require("assert") ;
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import AstUtility from '../../src/utils/ast'

describe("Contract parsing simples", () => {
  const file_name = "./test/sol_files/storage.sol";
  const ast = AstUtility.getContractAST(file_name);

  it(`Test case - should have all expected contract elements for ${file_name}`, async () => {
    const contracts:Contract[] = SolidityAntlr.parseContracts(ast);
    
    expect(contracts[0].name).toEqual("TestSuper");
    expect(contracts[1].name).toEqual("TestStorage");

    expect(contracts[0].kind).toEqual("contract");
    expect(contracts[0].kind).toEqual("contract");

    expect(contracts[1].baseContracts.length).toEqual(1);
    expect(contracts[0].baseContracts.length).toEqual(0);

    expect(contracts[0].subNodes.branch.length).toEqual(2)
    expect(contracts[1].subNodes.branch.length).toEqual(12)

    expect(contracts[0].range[0]).toEqual(25)
    expect(contracts[0].range[1]).toEqual(107)

    expect(contracts[0].loc.start.line).toEqual(3)
    expect(contracts[0].loc.end.line).toEqual(6)

    //for (const contract of contracts){
    //  AstUtility.printNode(contract.baseContracts)
    //} 
  });

});

describe("Contract parsing with imports", () => {
  const file_name = "./test/sol_files/MDTCrowdsale.sol";
  const ast = AstUtility.getContractAST(file_name);

  it(`Test case - should have all expected contract elements for ${file_name}`, async () => {
    const current_contracts:Contract[] = SolidityAntlr.parseContracts(ast);
    const imports:Import[] = SolidityAntlr.parseImports(ast);

    for (const i of imports){
      const i_ast = AstUtility.getContractAST("./test/sol_files/" + i.path);
      const imported_contracts:Contract[] = SolidityAntlr.parseContracts(i_ast);
      const all_contracts:Contract[] = current_contracts.concat(imported_contracts);

      expect(all_contracts[2].name).toEqual("SafeMath");
      expect(all_contracts[2].kind).toEqual("library");
      expect(all_contracts[2].baseContracts.length).toEqual(0);
      expect(all_contracts[2].subNodes.branch.length).toEqual(5)
      expect(all_contracts[2].range[0]).toEqual(117)
      expect(all_contracts[2].loc.start.line).toEqual(7)
      expect(all_contracts[2].loc.end.line).toEqual(65)

      /*
      for (const contract of all_contracts){
        AstUtility.printNode(contract.name)
        AstUtility.printNode(contract.kind)
        AstUtility.printNode(contract.baseContracts)
        AstUtility.printNode(contract.subNodes)
      } 
      */
    }

  });

});


