const assert = require("assert") ;
const expect = require("expect");

import FileUtils from '../../src/utils/file'
import Analyzer from '../../src/maru/analyzer'
import SolidityAntlr from '../../src/parser/solidity_antlr'
import Contract from '../../src/declarations/contract'
import Import from '../../src/declarations/import'
import AstUtility from '../../src/utils/ast'

describe("Import parsing", () => {
  const file_name = "./test/sol_files/MDTCrowdsale.sol";
  const file_content = FileUtils.getFileContent(file_name);
  const ast = Analyzer.generateAST(file_name, file_content);

  it(`Test case - should have all expected imports for ${file_name}`, async () => {
    const imports:Import[] = SolidityAntlr.parseImports(ast)

    expect(imports[0].path).toEqual("./SafeMath.sol")
    //expect(imports[1].path).toEqual("https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol")


    //for (const i of imports){
    //  AstUtility.printNode(i)
    //} 

  });

});



