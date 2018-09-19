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
        const linenumber_start = AstUtility.getStartLine(variable);
        const linenumber_end = AstUtility.getEndLine(variable);
        const issuePointer = new IssuePointer('SWC-109', linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
