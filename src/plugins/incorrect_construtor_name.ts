const parser = require("solidity-parser-antlr");

import StringUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let IncorrectConstructorName: Plugin;

IncorrectConstructorName = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];

  for (const c of sol_file.contracts_current) {
    if (!c.hasConstructor()) {
      for (const f of c.functions) {
        if (StringUtility.matchRegex(f.name, new RegExp("^" + c.name + "$", 'i'))) {
          issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], f.location));
        }

        else if (StringUtility.matchRegex(f.name, new RegExp("^constructor$", 'i'))) {
          issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[1], f.location));
        }
      }
    }
  }

  return issuePointers;
};

exports.IncorrectConstructorName = IncorrectConstructorName;