const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";


exports.InsecureIntegerArithmetic = (ast: any) => {
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    ExpressionStatement(node: any) {
      const expr = node.expression;
      if (expr.type === "BinaryOperation") {
        let code = "";
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
        const issuePointer = new IssuePointer("SWC-101", linenumber, linenumber, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });

  return issuePointers;
};
