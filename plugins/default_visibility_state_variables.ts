const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DefaultVisibilityStateVariable: Plugin;
const id = "SWC-108";

DefaultVisibilityStateVariable = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  parser.visit(ast, {
    StateVariableDeclaration(node: any) {
      const variable = node.variables[0];

      if (AstUtility.isDefaultVisibility(variable) && variable.isDeclaredConst === false) {
        issuePointers.push(AstUtility.createIssuePointerFromNode(id,variable));
      }
    },
  });
  return issuePointers;
};

exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
