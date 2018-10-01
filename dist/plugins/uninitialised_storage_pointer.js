"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
const issue_1 = require("../src/issue");
exports.UndeclaredStoragePointer = (ast) => {
    const issuePointers = [];
    parser.visit(ast, {
        VariableDeclaration(node) {
            const variable = node;
            if (variable.storageLocation == null && variable.isStateVar === false &&
                variable.typeName.type === "UserDefinedTypeName") {
                const linenumber_start = ast_utility_1.default.getStartLine(variable);
                const linenumber_end = ast_utility_1.default.getEndLine(variable);
                const issuePointer = new issue_1.IssuePointer("SWC-109", linenumber_start, linenumber_end, undefined, undefined);
                issuePointers.push(issuePointer);
            }
        },
    });
    return issuePointers;
};
