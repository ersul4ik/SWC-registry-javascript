const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Pragma from "../declarations/pragma";

let LockPragma: Plugin;

LockPragma = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];

  if (!AstUtility.isVersionFixed(sol_file.pragma.value)) {
    issuePointers.push(new IssuePointer(plugin_config.swcID, sol_file.pragma.location));
  }

  return issuePointers;
};

exports.LockPragma = LockPragma;
