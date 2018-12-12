const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Pragma from "../declarations/pragma";

let LockPragma: Plugin;

LockPragma = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    if (!NodeUtility.isVersionFixed(sol_file.pragma[0].value)) {
        issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], sol_file.pragma[0].location));
    }

    return issuePointers;
};

exports.LockPragma = LockPragma;
