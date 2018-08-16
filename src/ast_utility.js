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

  static getStartLine(node){
    return node['loc']['start']['line']
  }

  static getEndLine(node){
    return node['loc']['end']['line']
  }

  static isVersionFixed(version){
    return !version.match(/\^/)
  }

  static isDefaultVisibility(variable){
    return variable.visibility.match(/default/)
  }

}


module.exports = AstUtility;