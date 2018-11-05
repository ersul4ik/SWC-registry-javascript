const parser = require("solidity-parser-antlr");

import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let Test: Plugin;

Test = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  parser.visit(ast, {
    ContractDefinition(node: any) {
      console.log(node)  
      AstUtility.printNode(node) ;
    },
  });
  return issuePointers;
};

exports.Test = Test;