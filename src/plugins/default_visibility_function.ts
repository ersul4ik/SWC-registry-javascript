const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";


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