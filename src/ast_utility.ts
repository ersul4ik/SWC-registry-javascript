const parser = require("solidity-parser-antlr");

class AstUtility {
  static getContractName(ast: any) {
    let contractName = "";
    parser.visit(ast, {
      ContractDefinition(node: any) {
        contractName = node.name;
      },
    });
    return contractName;
  }

  static getStartLine(node: any) {
    return node.loc.start.line;
  }

  static getEndLine(node: any) {
    return node.loc.end.line;
  }

  static isVersionFixed(version: string) {
    return !version.match(/\^/);
  }

  static isDefaultVisibility(variable: any) {
    return variable
      .visibility
      .match(/default/);
  }
}

export default AstUtility;
