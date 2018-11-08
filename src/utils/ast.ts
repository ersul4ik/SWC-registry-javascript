const parser = require("solidity-parser-antlr");
const util = require("util");

import logger from "../logger/logger";
import Analyzer from "../maru/analyzer";
import { IssuePointer } from "../maru/issue";
import FileUtils from "./file";



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

  static createIssuePointerFromNode(id:string, node:any): IssuePointer {
    const linenumber_start = AstUtility.getStartLine(node);
    const linenumber_end = AstUtility.getEndLine(node);
    const issuePointer = new IssuePointer(id, linenumber_start, linenumber_end, undefined, undefined);
    return issuePointer;
  }

  static matchRegex(node:any, match:RegExp): boolean {
    if(node !== null && node !== undefined ){
      if(node.match(match)){
        return true;
      }
    }
    return false;
  }


  static matchString(node:any, match:string):boolean{
    if(node !== null && node !== undefined ){
      if(node.match(match)){
        return true;
      }
    }
    return false;
  }

  static logNode(node: any):void {
    logger.info(JSON.stringify(node, null, 4));
  }

  static printNode(node: any):void {
    console.log(JSON.stringify(node, null, 4));
  }

  static getSolAntlrAST(file_name: string): any {
    const file_content = FileUtils.getFileContent(file_name);
    const ast = Analyzer.generateAST(file_name, file_content);
    
    return ast;
  }

}

export default AstUtility;
