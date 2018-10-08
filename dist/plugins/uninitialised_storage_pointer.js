"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("solidity-parser-antlr");
const ast_utility_1 = __importDefault(require("../src/ast_utility"));
let UndeclaredStoragePointer;
const id = "SWC-109";
UndeclaredStoragePointer = function (ast) {
    const issuePointers = [];
    parser.visit(ast, {
        VariableDeclarationStatement(var_declaration_statement) {
            parser.visit(var_declaration_statement, {
                VariableDeclaration(var_declaration) {
                    const variable = var_declaration;
                    if (variable.storageLocation == null && variable.isStateVar === false &&
                        variable.typeName.type === "UserDefinedTypeName" && var_declaration_statement.initialValue === null) {
                        issuePointers.push(ast_utility_1.default.createIssuePointerFromNode(id, variable));
                    }
                },
            });
        },
    });
    return issuePointers;
};
exports.UndeclaredStoragePointer = UndeclaredStoragePointer;
