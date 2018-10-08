"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const util = require("util");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let DeprecatedFunctions;
const id = "SWC-111";
DeprecatedFunctions = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        FunctionCall(f_call) {
            parser.visit(f_call, {
                Identifier(identifier) {
                    if (ast_utility_1.default.matchRegex(identifier.name, new RegExp("sha3")) || ast_utility_1.default.matchRegex(identifier.name, new RegExp("suicide"))) {
                        issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, identifier));
                    }
                }
            });
            parser.visit(f_call, {
                MemberAccess(member) {
                    if (ast_utility_1.default.matchRegex(member.memberName, new RegExp("callcode"))) {
                        issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, member));
                    }
                }
            });
        },
        MemberAccess(member) {
            parser.visit(member, {
                Identifier(identifier) {
                    if (ast_utility_1.default.matchRegex(identifier.name, new RegExp("msg")) && ast_utility_1.default.matchRegex(member.memberName, new RegExp("gas"))) {
                        issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, member));
                    }
                    if (ast_utility_1.default.matchRegex(identifier.name, new RegExp("block")) && ast_utility_1.default.matchRegex(member.memberName, new RegExp("blockhash"))) {
                        issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, member));
                    }
                }
            });
        },
        ThrowStatement(throw_statement) {
            issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, throw_statement));
        },
        FunctionDefinition(func) {
            if (ast_utility_1.default.matchRegex(func.stateMutability, new RegExp("constant"))) {
                issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, func));
            }
        }
    });
    return issuePointers;
};
exports.DeprecatedFunctions = DeprecatedFunctions;
