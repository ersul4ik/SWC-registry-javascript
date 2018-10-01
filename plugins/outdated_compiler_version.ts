const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
const semver = require("semver");

exports.OutdatedCompilerVersion = (ast: any) => {
  const issuePointers: IssuePointer[] = [];
  const oldest_recommended_version = "0.4.23";
  parser.visit(ast, {
    PragmaDirective(node: any) {
      const version = node.value;
      if (semver.lt(version.replace("^", ""), oldest_recommended_version)) {
        const linenumber_start = AstUtility.getStartLine(node);
        const linenumber_end = AstUtility.getEndLine(node);
        const issuePointer = new IssuePointer("SWC-102", linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
