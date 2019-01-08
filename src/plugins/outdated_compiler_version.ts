const parser = require("solidity-parser-antlr");
const semver = require("semver");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import DescriptionUtils from "../utils/description";
import Description from "../maru/description";
import PragmaUtils from "../utils/pragma";

let OutdatedCompilerVersion: Plugin;

OutdatedCompilerVersion = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    const oldest_recommended_version = "0.4.23";

    for (const source of sol_file.sources) {
        for (const pragma of source.pragmas) {
            if (pragma.name.match("solidity")) {
                if (PragmaUtils.isVersionFixed(pragma.value)) {
                    if (semver.lt(pragma.value, oldest_recommended_version)) {
                        const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                            pragma.value
                        ]);
                        issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, pragma.location));
                    }
                }
            }
        }
    }

    return issuePointers;
};

exports.OutdatedCompilerVersion = OutdatedCompilerVersion;
