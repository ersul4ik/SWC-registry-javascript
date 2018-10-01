"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
const issue_1 = require("../src/issue");
const semver = require("semver");
exports.OutdatedCompilerVersion = (ast) => {
    const issuePointers = [];
    const oldest_recommended_version = "0.4.23";
    parser.visit(ast, {
        PragmaDirective(node) {
            const version = node.value;
            if (semver.lt(version.replace("^", ""), oldest_recommended_version)) {
                const linenumber_start = ast_utility_1.default.getStartLine(node);
                const linenumber_end = ast_utility_1.default.getEndLine(node);
                const issuePointer = new issue_1.IssuePointer("SWC-102", linenumber_start, linenumber_end, undefined, undefined);
                issuePointers.push(issuePointer);
            }
        },
    });
    return issuePointers;
};
