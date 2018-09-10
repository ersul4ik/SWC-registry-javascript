const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.OutdatedCompilerVersion = (ast) => {
  const issuePointers = [];
  parser.visit(ast, {
    PragmaDirective(node) {
      const version = node.value;
      const versionParts = version.split('.');
      if (versionParts[1] <= 4) {
        if (versionParts[2] <= 23) {
          const linenumber = AstUtility.getStartLine(node);
          const issuePointer = new IssuePointer(linenumber);
          issuePointers.push(issuePointer);
        }
      }
    },
  });
  return issuePointers;
};
