const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.LockPragma = (ast) => {
  const issuePointers = [];

  parser.visit(ast, {
    PragmaDirective(node) {
      if (!AstUtility.isVersionFixed(node.value)) {
        const linenumber = AstUtility.getStartLine(node);
        const issuePointer = new IssuePointer(linenumber);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
