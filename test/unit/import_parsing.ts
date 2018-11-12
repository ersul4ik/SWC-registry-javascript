const assert = require("assert");
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import AstUtility from '../../src/utils/ast'

describe("Import parsing", () => {
  const file_name = "./test/sol_files/imports/A.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should list all expected imports for ${file_name}`, async () => {
    const imports: Import[] = SolidityAntlr.parseImports(file_name, ast)

    expect(imports[0].path).toEqual("test/sol_files/imports/lib/B.sol")

    /*
    for (const i of imports){
      AstUtility.printNode(i)
    } 
    */

  });


  it(`Test case - should list all expected imports for ${file_name} and any other imports`, async () => {
    const imports: Import[] = SolidityAntlr.parseAllImports(file_name, ast)

    expect(imports[0].path).toEqual("test/sol_files/imports/lib/B.sol")
    expect(imports[1].path).toEqual("test/sol_files/imports/lib2/C.sol")
    expect(imports[2].path).toEqual("test/sol_files/imports/lib2/D.sol")

  });




});



/*
describe("Contract parsing with imports", () => {
  const file_name = "./test/sol_files/contract_inherit_complex.sol";
  const ast = SolidityAntlr.generateAST(file_name);

  it(`Test case - should have all expected contract elements for ${file_name}`, async () => {
    const current_contracts:Contract[] = SolidityAntlr.parseContracts(ast);
    const imports:Import[] = SolidityAntlr.parseImports(ast);

    for (const i of imports){
      const i_ast = SolidityAntlr.generateAST("./test/sol_files/" + i.path);
      const imported_contracts:Contract[] = SolidityAntlr.parseContracts(i_ast);
      const all_contracts:Contract[] = current_contracts.concat(imported_contracts);

      expect(all_contracts[2].name).toEqual("SafeMath");
      expect(all_contracts[2].kind).toEqual("library");
      expect(all_contracts[2].baseContracts.length).toEqual(0);
      expect(all_contracts[2].subNodes.branch.length).toEqual(5)

      expect(all_contracts[2].location.lineNumberStart).toEqual(7);
      expect(all_contracts[2].location.lineNumberEnd).toEqual(65);
      expect(all_contracts[2].location.columnStart).toEqual(0);
      expect(all_contracts[2].location.columnEnd).toEqual(0);
      expect(all_contracts[2].location.src).toEqual("117:1531:0");


      
      for (const contract of all_contracts){
        AstUtility.printNode(contract.name)
        AstUtility.printNode(contract.kind)
        AstUtility.printNode(contract.baseContracts)
        AstUtility.printNode(contract.subNodes)
      } 
      
    }

  });

});

*/
