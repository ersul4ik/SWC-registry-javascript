const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Pragma from "../core/declarations/pragma";

let LockPragma: Plugin;

LockPragma = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const pragma of sol_file.pragmas) {
        if (pragma.name.match("solidity")) {
            if (!NodeUtility.isVersionFixed(pragma.value)) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], sol_file.pragmas[0].location));
            }
        }
    }

    return issuePointers;
};

exports.LockPragma = LockPragma;
