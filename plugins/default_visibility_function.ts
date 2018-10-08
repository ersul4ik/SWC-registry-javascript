const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DefaultVisibilityFunction: Plugin;

DefaultVisibilityFunction = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  parser.visit(ast, {
    FunctionDefinition(node: any) {
      const func = node;
      if (AstUtility.isDefaultVisibility(func)) {
        const linenumber_start = AstUtility.getStartLine(func);
        const linenumber_end = AstUtility.getEndLine(func);

        const issuePointer = new IssuePointer("SWC-100", linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};


exports.DefaultVisibilityFunction = DefaultVisibilityFunction;