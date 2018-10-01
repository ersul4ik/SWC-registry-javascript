"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
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
}
exports.default = AstUtility;
