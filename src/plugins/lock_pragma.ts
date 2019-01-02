const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Pragma from "../core/declarations/pragma";
import PragmaUtils from "../utils/pragma";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let LockPragma: Plugin;

LockPragma = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const source of sol_file.sources) {
        for (const pragma of source.pragmas) {
            if (pragma.name.match("solidity")) {
                if (!PragmaUtils.isVersionFixed(pragma.value)) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        pragma.value.replace(/\^/, "")
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, pragma.location));
                }
            }
        }
    }

    return issuePointers;
};

exports.LockPragma = LockPragma;
