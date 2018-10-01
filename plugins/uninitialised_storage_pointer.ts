const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";

exports.UndeclaredStoragePointer = (ast: any) => {
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    VariableDeclaration(node: any) {
      const variable = node;
      if (variable.storageLocation == null && variable.isStateVar === false &&
        variable.typeName.type === "UserDefinedTypeName") {
        const linenumber_start = AstUtility.getStartLine(variable);
        const linenumber_end = AstUtility.getEndLine(variable);
        const issuePointer = new IssuePointer("SWC-109", linenumber_start, linenumber_end, undefined, undefined);
        issuePointers.push(issuePointer);
      }
    },
  });
  return issuePointers;
};
