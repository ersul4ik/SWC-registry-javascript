const parser = require("solidity-parser-antlr");
const semver = require("semver");

import StringUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let OutdatedCompilerVersion: Plugin;

OutdatedCompilerVersion = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];
  const oldest_recommended_version = "0.4.23";

  if (semver.lt(sol_file.pragma.value.replace("^", ""), oldest_recommended_version)) {
    issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], sol_file.pragma.location));
  }

  return issuePointers;
};

exports.OutdatedCompilerVersion = OutdatedCompilerVersion;