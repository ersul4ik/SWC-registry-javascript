const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let UndeclaredStoragePointer: Plugin;
const id = "SWC-109";

UndeclaredStoragePointer = function (ast: any){
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    VariableDeclarationStatement(var_declaration_statement: any) {
      parser.visit(var_declaration_statement, {
        VariableDeclaration(var_declaration: any) {
          const variable = var_declaration;
          if (variable.storageLocation == null && variable.isStateVar === false &&
            variable.typeName.type === "UserDefinedTypeName" && var_declaration_statement.initialValue === null) {
              issuePointers.push(AstUtility.createIssuePointerFromNode(id,variable));
          }
        },
      });
    },
  });

  return issuePointers;
};

exports.UndeclaredStoragePointer = UndeclaredStoragePointer;