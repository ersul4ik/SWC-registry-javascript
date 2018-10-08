"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const util = require("util");
const issue_1 = require("../src/issue");
class AstUtility {
    static getContractName(ast) {
        let contractName = "";
        parser.visit(ast, {
            ContractDefinition(node) {
                contractName = node.name;
            },
        });
        return contractName;
    }
    static getStartLine(node) {
        return node.loc.start.line;
    }
    static getEndLine(node) {
        return node.loc.end.line;
    }
    static isVersionFixed(version) {
        return !version.match(/\^/);
    }
    static isDefaultVisibility(variable) {
        return variable
            .visibility
            .match(/default/);
    }
    static createIssuePointerFromNode(id, node) {
        const linenumber_start = AstUtility.getStartLine(node);
        const linenumber_end = AstUtility.getEndLine(node);
        const issuePointer = new issue_1.IssuePointer(id, linenumber_start, linenumber_end, undefined, undefined);
        return issuePointer;
    }
    static matchRegex(node, match) {
        if (node !== null && node !== undefined) {
            if (node.match(match)) {
                return true;
            }
        }
        return false;
    }
    static printNode(node) {
        console.log(JSON.stringify(node, null, 4));
    }
}
exports.default = AstUtility;
