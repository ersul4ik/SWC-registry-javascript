"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const util = require("util");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
const issue_1 = require("../src/issue");
let DeprecatedFunctions;
DeprecatedFunctions = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        FunctionCall(node) {
            //console.log("-")
            // console.log(util.inspect(node1, false, null))
            //parser.visit(node1, {
            // FunctionCall: function(node) {
            //Identifier(node2: any) {
            // console.log(util.inspect(node2, false, null))
            //},
            // });
            // console.log(util.inspect(node2, false, null))
            // exp = node.expression;
            console.log(node.name);
            if (node.name != undefined) {
                if (node.name.match(/sha3/) || node.name.match(/suicide/)) {
                    const linenumber_start = ast_utility_1.default.getStartLine(node);
                    const linenumber_end = ast_utility_1.default.getEndLine(node);
                    const issuePointer = new issue_1.IssuePointer("SWC-111", linenumber_start, linenumber_end, undefined, undefined);
                    issuePointers.push(issuePointer);
                }
            }
        }
    });
    return issuePointers;
};
exports.DeprecatedFunctions = DeprecatedFunctions;
