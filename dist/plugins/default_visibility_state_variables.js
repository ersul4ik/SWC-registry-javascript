"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
const issue_1 = require("../src/issue");
let DefaultVisibilityStateVariable;
DefaultVisibilityStateVariable = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        StateVariableDeclaration(node) {
            const variable = node.variables[0];
            if (ast_utility_1.default.isDefaultVisibility(variable) && variable.isDeclaredConst === false) {
                const linenumber_start = ast_utility_1.default.getStartLine(variable);
                const linenumber_end = ast_utility_1.default.getEndLine(variable);
                const issuePointer = new issue_1.IssuePointer("SWC-108", linenumber_start, linenumber_end, undefined, undefined);
                issuePointers.push(issuePointer);
            }
        },
    });
    return issuePointers;
};
exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
