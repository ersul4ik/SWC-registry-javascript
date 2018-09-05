const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.DefaultVisibilityStateVariable = (ast) => {
  const issuePointers = [];
  parser.visit(ast, {
    StateVariableDeclaration(node) {
      const variable = node.variables[0];

      if (AstUtility.isDefaultVisibility(variable) && variable.isDeclaredConst === false) {
        const linenumber = AstUtility.getStartLine(variable);
        const issuePointer = new IssuePointer(linenumber);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
