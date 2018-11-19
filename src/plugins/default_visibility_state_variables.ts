const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Variable from "../declarations/variable";

let DefaultVisibilityStateVariable: Plugin;

DefaultVisibilityStateVariable = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];

  for (const c of sol_file.contracts_current) {
    for (const v of c.variables) {
      if (AstUtility.matchRegex(v.visibility, new RegExp("default")) && v.isConstant === false) {
        issuePointers.push(new IssuePointer(plugin_config.swcID, v.location));
      }

    }
  }

  return issuePointers;
};

exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
