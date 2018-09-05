const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.DefaultVisibilityFunction = (ast) => {
  const issuePointers = [];

  parser.visit(ast, {
    FunctionDefinition(node) {
      const func = node;
      if (AstUtility.isDefaultVisibility(func)) {
        const linenumber = AstUtility.getStartLine(func);
        const issuePointer = new IssuePointer(linenumber);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
