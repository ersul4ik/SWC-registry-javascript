const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import DescriptionUtils from "../utils/description";
import Description from "../maru/description";

let IncorrectConstructorName: Plugin;

IncorrectConstructorName = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const c of sol_file.contracts) {
        if (!c.hasConstructor()) {
            for (const f of c.functions) {
                if (NodeUtility.matchRegex(f.name, new RegExp("^" + c.name + "$", "i"))) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        c.name,
                        f.name
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f.location));
                } else if (NodeUtility.matchRegex(f.name, new RegExp("^constructor$", "i"))) {
                    issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[1], f.location));
                }
            }
        }
    }

    return issuePointers;
};

exports.IncorrectConstructorName = IncorrectConstructorName;
