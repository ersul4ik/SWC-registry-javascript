const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let DefaultVisibilityFunction: Plugin;

DefaultVisibilityFunction = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    /*
    for (const f of sol_file.getContractFunctions()) {
        if (f.visibility.match(/default/)) {
            issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], f.location));
        }
    }
*/
    return issuePointers;
};

exports.DefaultVisibilityFunction = DefaultVisibilityFunction;
