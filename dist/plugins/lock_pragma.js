"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let LockPragma;
const id = "SWC-103";
LockPragma = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        PragmaDirective(node) {
            if (!ast_utility_1.default.isVersionFixed(node.value)) {
                issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, node));
            }
        },
    });
    return issuePointers;
};
exports.LockPragma = LockPragma;
