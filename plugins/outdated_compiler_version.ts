const parser = require("solidity-parser-antlr");
const semver = require("semver");

import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let OutdatedCompilerVersion: Plugin;
const id = "SWC-102";

OutdatedCompilerVersion = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  const oldest_recommended_version = "0.4.23";
  parser.visit(ast, {
    PragmaDirective(node: any) {
      const version = node.value;
      if (semver.lt(version.replace("^", ""), oldest_recommended_version)) {
        issuePointers.push(AstUtility.createIssuePointerFromNode(id,node));
      }
    },
  });
  return issuePointers;
};

exports.OutdatedCompilerVersion = OutdatedCompilerVersion;