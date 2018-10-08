const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DefaultVisibilityStateVariable: Plugin;

DefaultVisibilityStateVariable = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  parser.visit(ast, {
    StateVariableDeclaration(node: any) {
      const variable = node.variables[0];

      if (AstUtility.isDefaultVisibility(variable) && variable.isDeclaredConst === false) {
        const linenumber_start = AstUtility.getStartLine(variable);
        const linenumber_end = AstUtility.getEndLine(variable);
        const issuePointer = new IssuePointer("SWC-108", linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};

exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
