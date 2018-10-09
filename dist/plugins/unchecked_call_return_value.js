"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let UncheckedCallReturnValue;
const id = "SWC-104";
/*
 * Find the outer left function of an ExpressionStatement. If that is a call or delegate call then raise an issue
 */
UncheckedCallReturnValue = function (ast) {
    const issuePointers = [];
    let functions = [];
    let expression_nr = 0;
    ast_utility_1.default.printNode(ast);
    parser.visit(ast, {
        ExpressionStatement(expr) {
            expression_nr += 1;
            parser.visit(expr, {
                FunctionCall(f_call) {
                    parser.visit(f_call, {
                        MemberAccess(mb) {
                            if (ast_utility_1.default.matchRegex(mb.memberName, new RegExp("^call$")) ||
                                ast_utility_1.default.matchRegex(mb.memberName, new RegExp("^delegatecall$")) ||
                                ast_utility_1.default.matchRegex(mb.memberName, new RegExp("^send$")) ||
                                ast_utility_1.default.matchRegex(mb.memberName, new RegExp("^callcode$"))) {
                                let entry = {};
                                entry['expr_nr'] = expression_nr;
                                entry['expr_range'] = expr.range;
                                entry['type'] = mb.memberName;
                                entry['type_range'] = mb.range;
                                entry['node'] = f_call;
                                functions.push(entry);
                                console.log(entry);
                            }
                        }
                    });
                    parser.visit(f_call, {
                        Identifier(identifier) {
                            if (ast_utility_1.default.matchRegex(identifier.name, new RegExp("^require$")) ||
                                ast_utility_1.default.matchRegex(identifier.name, new RegExp("^assert$"))) {
                                let entry = {};
                                entry['expr_nr'] = expression_nr;
                                entry['expr_range'] = expr.range;
                                entry['type'] = identifier.name;
                                entry['type_range'] = identifier.range;
                                entry['node'] = f_call;
                                functions.push(entry);
                            }
                        }
                    });
                }
            });
        },
    });
    for (let i = 1; i <= expression_nr; i++) {
        let outer_caller = {};
        let functions_of_expr = getFunctionsForExprStatement(i, functions);
        if (functions_of_expr.length >= 1) {
            outer_caller = functions_of_expr[0];
        }
        if (functions_of_expr.length > 1) {
            for (let x = 0; x < functions_of_expr.length; x++) {
                // AstUtility.printNode(functions_of_expr[x])
                if (functions_of_expr[x]['type_range'][0] < outer_caller['type_range'][0]) {
                    outer_caller = functions_of_expr[x];
                }
            }
        }
        if (ast_utility_1.default.matchRegex(outer_caller['type'], new RegExp("^call$")) ||
            ast_utility_1.default.matchRegex(outer_caller['type'], new RegExp("^delegatecall$")) ||
            ast_utility_1.default.matchRegex(outer_caller['type'], new RegExp("^send$")) ||
            ast_utility_1.default.matchRegex(outer_caller['type'], new RegExp("^callcode$"))) {
            issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, outer_caller['node']));
        }
    }
    return issuePointers;
};
function getFunctionsForExprStatement(expr_id, functions) {
    let functions_of_expr = [];
    for (let i = 0; i < functions.length; i++) {
        if (functions[i]['expr_nr'] === expr_id) {
            functions_of_expr.push(functions[i]);
        }
    }
    return functions_of_expr;
}
exports.UncheckedCallReturnValue = UncheckedCallReturnValue;
