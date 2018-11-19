const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let UndeclaredStoragePointer: Plugin;

UndeclaredStoragePointer = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];

  for (const c of sol_file.contracts_current) {
    for (const v of c.variables) {
      if (v.storageLocation == null && v.isStateVar === false &&
        v.type.type === "UserDefinedTypeName" && v.initialValue === null) {
        issuePointers.push(new IssuePointer(plugin_config.swcID, sol_file.pragma.location));
      }
    }
  }

  return issuePointers;
};

exports.UndeclaredStoragePointer = UndeclaredStoragePointer;