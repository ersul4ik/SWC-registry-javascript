const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.DefaultVisibilityFunction = (ast) => {
  const issuePointers = [];
  parser.visit(ast, {
    FunctionDefinition(node) {
      const func = node;
      if (AstUtility.isDefaultVisibility(func)) {
        const linenumber_start = AstUtility.getStartLine(func);
        const linenumber_end = AstUtility.getEndLine(func);

        const issuePointer = new IssuePointer('SWC-100', linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
