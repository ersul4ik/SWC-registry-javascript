const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let LockPragma: Plugin;
const id = "SWC-103";

LockPragma = (ast: any) => {
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    PragmaDirective(node: any) {
      if (!AstUtility.isVersionFixed(node.value)) {
        issuePointers.push(AstUtility.createIssuePointerFromNode(id, node));
      }
    },
  });
  return issuePointers;
};

exports.LockPragma = LockPragma;
