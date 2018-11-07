const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";


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
