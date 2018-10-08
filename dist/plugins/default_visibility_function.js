"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let DefaultVisibilityFunction;
const id = "SWC-100";
DefaultVisibilityFunction = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        FunctionDefinition(node) {
            const func = node;
            if (ast_utility_1.default.isDefaultVisibility(func)) {
                issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, func));
            }
        },
    });
    return issuePointers;
};
exports.DefaultVisibilityFunction = DefaultVisibilityFunction;
