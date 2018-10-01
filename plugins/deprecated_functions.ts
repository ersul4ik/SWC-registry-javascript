const parser = require("solidity-parser-antlr");
const util = require("util");

import AstUtility from "../src/ast_utility";
import { IssueDetailed, IssuePointer } from "../src/issue";

exports.DeprecatedFunctions = (ast: any) => {
  const issue_pointers: IssuePointer[] = [];

  parser.visit(ast, {
    // FunctionCall: function(node) {
    Block(node1: any) {
      // console.log(util.inspect(node1, false, null))
      parser.visit(node1, {
        // FunctionCall: function(node) {
        Identifier(node2: any) {
          // console.log(util.inspect(node2, false, null))
        },
      });

      // console.log(util.inspect(node2, false, null))
      // exp = node.expression;

      /*
	    	if(node.name.match(/sha3/) || node.name.match(/suicide/)){
	  			var linenumber = AstUtility.getStartLine(exp)
				var issue_pointer = new IssuePointer(linenumber)
				issue_pointers.push(issue_pointer);
	  		} */
    },
  });
  return issue_pointers;
};
