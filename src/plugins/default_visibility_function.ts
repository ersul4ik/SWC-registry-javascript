const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DefaultVisibilityFunction: Plugin;
const id = "SWC-100";

DefaultVisibilityFunction = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  parser.visit(ast, {
    FunctionDefinition(node: any) {
      const func = node;
      if (AstUtility.isDefaultVisibility(func)) {
        issuePointers.push(AstUtility.createIssuePointerFromNode(id,func));
      }
    },
  });
  return issuePointers;
};


exports.DefaultVisibilityFunction = DefaultVisibilityFunction;