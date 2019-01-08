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
import Location from "../misc/location";

let LockPragma: Plugin;

LockPragma = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const source of sol_file.sources) {
        let version_found: boolean = false;
        for (const pragma of source.pragmas) {
            if (pragma.name.match("solidity")) {
                version_found = true;
                if (!PragmaUtils.isVersionFixed(pragma.value)) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        PragmaUtils.getVersionWithoutCaret(pragma.value)
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, pragma.location));
                }
            }
        }
        if (!version_found) {
            issuePointers.push(
                new IssuePointer(
                    plugin_config.swcID,
                    plugin_config.description[1],
                    new Location(-1, sol_file.file_name, "0:0:0", 0, 0, 0, 0)
                )
            );
        }
    }

    return issuePointers;
};

exports.LockPragma = LockPragma;
