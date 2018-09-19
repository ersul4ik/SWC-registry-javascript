const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.OutdatedCompilerVersion = (ast) => {
  const issuePointers = [];
  const oldest_recommended_version = '0.4.23'.split('.')
  parser.visit(ast, {
    PragmaDirective(node) {
      const version = node.value;
      const versionParts = version.split('.');
      if (versionParts[1] <= oldest_recommended_version[1]) {
        if (versionParts[2] <= oldest_recommended_version[2]) {
          const linenumber_start = AstUtility.getStartLine(node);
          const linenumber_end = AstUtility.getEndLine(node);
          const issuePointer = new IssuePointer('SWC-102', linenumber_start, linenumber_end, undefined, undefined);
          issuePointers.push(issuePointer);
        }
      }
    },
  });
  return issuePointers;
};
