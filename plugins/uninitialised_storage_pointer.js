const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');
const AstUtility = require('../src/ast_utility.js');

exports.UndeclaredStoragePointer = (ast) => {
  const issuePointers = [];

  parser.visit(ast, {
    VariableDeclaration(node) {
      const variable = node;
      console.log(variable);
      if (variable.storageLocation == null && variable.isStateVar === false && variable.typeName.type === 'UserDefinedTypeName') {
        const linenumber = AstUtility.getStartLine(variable);
        const issuePointer = new IssuePointer(linenumber);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
