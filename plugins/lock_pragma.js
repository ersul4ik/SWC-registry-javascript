const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.LockPragma = (ast) => {
  const issuePointers = [];

  parser.visit(ast, {
    PragmaDirective(node) {
      if (!AstUtility.isVersionFixed(node.value)) {
        const linenumber_start = AstUtility.getStartLine(node);
        const linenumber_end = AstUtility.getEndLine(node);
        const issuePointer = new IssuePointer('EIPXXXX-SOL-FLOATING_PRAGMA', linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
