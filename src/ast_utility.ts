const parser = require("solidity-parser-antlr");
const util = require("util");

import logger from "../src/logger";
import { IssuePointer } from "../src/issue";

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

  static createIssuePointerFromNode(id:string, node:any){
    const linenumber_start = AstUtility.getStartLine(node);
    const linenumber_end = AstUtility.getEndLine(node);
    const issuePointer = new IssuePointer(id, linenumber_start, linenumber_end, undefined, undefined);
    return issuePointer;
  }

  static matchRegex(node:any, match:RegExp){
    if(node !== null && node !== undefined ){
      if(node.match(match)){
        return true;
      }
    }
    return false;
  }


  static matchString(node:any, match:string){
    if(node !== null && node !== undefined ){
      if(node.match(match)){
        return true;
      }
    }
    return false;
  }

  static printNode(node: any){
    logger.info(JSON.stringify(node, null, 4));
  }

}

export default AstUtility;
