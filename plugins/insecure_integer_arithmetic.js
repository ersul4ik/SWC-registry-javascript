const parser = require('solidity-parser-antlr');
const { IssuePointer } = require('../src/issue.js');

exports.InsecureIntegerArithmetic = (ast) => {
  const issuePointers = [];

  parser.visit(ast, {
    ExpressionStatement(node) {
      const expr = node.expression;
      if (expr.type === 'BinaryOperation') {
        /* eslint-disable-next-line no-unused-vars */
        let code = '';
        code += expr.left.name;
        code += expr.operator;

        if (expr.right.left !== undefined) {
          // Binary operator case (e.g. A + B)
          code += expr.right.left.name;
          code += expr.right.operator;
          code += expr.right.right.number;
        } else {
          // Unary operator (e.g. A += B)
          code += expr.right.name;
        }
        const linenumber = expr.loc.start.line;
        const issuePointer = new IssuePointer(linenumber);

        issuePointers.push(issuePointer);
      }
    },
  });

  return issuePointers;
};
