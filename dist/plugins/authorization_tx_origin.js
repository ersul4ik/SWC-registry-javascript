"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let AuthorizationTXOrigin;
const id = "SWC-115";
AuthorizationTXOrigin = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        BinaryOperation(b_op) {
            if (ast_utility_1.default.matchRegex(b_op.operator, new RegExp("==")) ||
                ast_utility_1.default.matchRegex(b_op.operator, new RegExp("!="))) {
                parser.visit(b_op, {
                    MemberAccess(member) {
                        parser.visit(b_op, {
                            Identifier(identifier) {
                                if (ast_utility_1.default.matchRegex(member.memberName, new RegExp("^origin$")) &&
                                    ast_utility_1.default.matchRegex(identifier.name, new RegExp("^tx$"))) {
                                    issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, member));
                                }
                            }
                        });
                    }
                });
            }
        },
    });
    return issuePointers;
};
exports.AuthorizationTXOrigin = AuthorizationTXOrigin;
