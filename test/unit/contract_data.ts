const assert = require("assert") ;
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import ASTDeclarationParser from '../../src/ast/declaration_parser'
import Contract from '../../src/declarations/contract'
import AstUtility from '../../src/utils/ast'

describe("Contract parsing", () => {
  const file_name = "./test/sol_files/storage.sol";
  const file_content = FileUtils.getFileContent(file_name);
  const ast = Analyzer.generateAST(file_name, file_content);

  it(`Test case - should have all expected contract elements from ${file_name}`, async () => {
    const contracts:Contract[] = ASTDeclarationParser.parseContracts(ast);
    
    expect(contracts[0].name).toEqual("TestSuper");
    expect(contracts[1].name).toEqual("TestStorage");

    expect(contracts[0].kind).toEqual("contract");
    expect(contracts[1].kind).toEqual("contract");

    expect(contracts[1].baseContracts.length).toEqual(1);
    expect(contracts[0].baseContracts.length).toEqual(0);

    expect(contracts[0].subNodes.length).toEqual(2)
    expect(contracts[1].subNodes.length).toEqual(12)


    expect(contracts[0].range[0]).toEqual(25)
    expect(contracts[0].range[1]).toEqual(107)

    expect(contracts[0].loc.start.line).toEqual(3)
    expect(contracts[0].loc.end.line).toEqual(6)

    //for (const contract of contracts){
    //  AstUtility.printNode(contract.baseContracts)
    //} 
  });

});



