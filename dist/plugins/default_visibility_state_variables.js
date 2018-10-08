"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let DefaultVisibilityStateVariable;
const id = "SWC-108";
DefaultVisibilityStateVariable = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        StateVariableDeclaration(node) {
            const variable = node.variables[0];
            if (ast_utility_1.default.isDefaultVisibility(variable) && variable.isDeclaredConst === false) {
                issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, variable));
            }
        },
    });
    return issuePointers;
};
exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
