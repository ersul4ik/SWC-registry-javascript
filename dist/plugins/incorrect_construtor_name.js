"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let IncorrectConstructorName;
const id = "SWC-118";
IncorrectConstructorName = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        ContractDefinition(node) {
            let contract_name = node.name;
            let has_constructor = false;
            parser.visit(node, {
                FunctionDefinition(func) {
                    if (func.isConstructor) {
                        has_constructor = true;
                    }
                },
            });
            if (!has_constructor) {
                parser.visit(node, {
                    FunctionDefinition(func) {
                        if (ast_utility_1.default.matchRegex(func.name, new RegExp("^" + contract_name + "$", 'i'))) {
                            issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, func));
                        }
                        else if (ast_utility_1.default.matchRegex(func.name, new RegExp("^constructor$", 'i'))) {
                            issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, func));
                        }
                        console.log(func.name);
                    },
                });
            }
        },
    });
    return issuePointers;
};
exports.IncorrectConstructorName = IncorrectConstructorName;
