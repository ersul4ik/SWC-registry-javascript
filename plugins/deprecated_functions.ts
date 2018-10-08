const parser = require("solidity-parser-antlr");
const util = require("util");

import AstUtility from "../src/ast_utility";
import { IssueDetailed, IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DeprecatedFunctions: Plugin;

DeprecatedFunctions = function (ast: any){
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    FunctionCall(node: any) {
      //console.log("-")
  
      // console.log(util.inspect(node1, false, null))
      //parser.visit(node1, {
        // FunctionCall: function(node) {
        //Identifier(node2: any) {
          // console.log(util.inspect(node2, false, null))
        //},
     // });

      // console.log(util.inspect(node2, false, null))
      // exp = node.expression;
      console.log(node.name)
      

      if (node.name != undefined){

        if(node.name.match(/sha3/) || node.name.match(/suicide/)){
          const linenumber_start = AstUtility.getStartLine(node);
          const linenumber_end = AstUtility.getEndLine(node);
          const issuePointer = new IssuePointer("SWC-111", linenumber_start, linenumber_end, undefined, undefined);
          issuePointers.push(issuePointer);
        }
      }
    }  
  });
  return issuePointers;
};


exports.DeprecatedFunctions = DeprecatedFunctions;