"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
const issue_1 = require("../src/issue");
let DefaultVisibilityFunction;
DefaultVisibilityFunction = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        FunctionDefinition(node) {
            const func = node;
            if (ast_utility_1.default.isDefaultVisibility(func)) {
                const linenumber_start = ast_utility_1.default.getStartLine(func);
                const linenumber_end = ast_utility_1.default.getEndLine(func);
                const issuePointer = new issue_1.IssuePointer("SWC-100", linenumber_start, linenumber_end, undefined, undefined);
                issuePointers.push(issuePointer);
            }
        },
    });
    return issuePointers;
};
exports.DefaultVisibilityFunction = DefaultVisibilityFunction;
