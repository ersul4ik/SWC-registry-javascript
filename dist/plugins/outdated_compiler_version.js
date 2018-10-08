"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const semver = require("semver");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let OutdatedCompilerVersion;
const id = "SWC-102";
OutdatedCompilerVersion = function (ast) {
    const issuePointers = [];
    const oldest_recommended_version = "0.4.23";
    parser.visit(ast, {
        PragmaDirective(node) {
            const version = node.value;
            if (semver.lt(version.replace("^", ""), oldest_recommended_version)) {
                issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, node));
            }
        },
    });
    return issuePointers;
};
exports.OutdatedCompilerVersion = OutdatedCompilerVersion;
