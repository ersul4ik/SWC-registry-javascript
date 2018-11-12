const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";

let DefaultVisibilityFunction: Plugin;
const id = "SWC-100";

DefaultVisibilityFunction = function (sol_file: SolFile) {
  const issuePointers: IssuePointer[] = [];

  for (const f of sol_file.getContractFunctions()) {
    if (f.visibility.match(/default/)) {
      issuePointers.push(new IssuePointer(id, f.location));
    }
  }
  return issuePointers;
};

exports.DefaultVisibilityFunction = DefaultVisibilityFunction;