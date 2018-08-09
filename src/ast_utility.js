const parser = require('solidity-parser-antlr');

class AstUtility{
    static getContractName (ast) {
      var contract_name = ""
      parser.visit(ast, {
        ContractDefinition: function(node) {

          contract_name = node.name
        }
      })
      return contract_name
  }
}


module.exports = AstUtility;