"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const issue_1 = require("../src/issue");
exports.InsecureIntegerArithmetic = (ast) => {
    const issuePointers = [];
    parser.visit(ast, {
        ExpressionStatement(node) {
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
                }
                else {
                    // Unary operator (e.g. A += B)
                    code += expr.right.name;
                }
                const linenumber = expr.loc.start.line;
                const issuePointer = new issue_1.IssuePointer("SWC-101", linenumber, linenumber, undefined, undefined);
                issuePointers.push(issuePointer);
            }
        },
    });
    return issuePointers;
};
