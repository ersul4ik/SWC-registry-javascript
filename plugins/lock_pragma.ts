const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";

exports.LockPragma = (ast: any) => {
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    PragmaDirective(node: any) {
      if (!AstUtility.isVersionFixed(node.value)) {
        const linenumber_start = AstUtility.getStartLine(node);
        const linenumber_end = AstUtility.getEndLine(node);
        const issuePointer = new IssuePointer("SWC-103", linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
