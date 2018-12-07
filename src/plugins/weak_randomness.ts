const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import FunctionCall from "../expressions/function_call";
import SolidityAntlr from "../parser/solidity_antlr";
import StringUtility from "../utils/ast";

let WeakRandomnessFunction: Plugin;

WeakRandomnessFunction = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const c of sol_file.contracts_current) {
        const f_cs: FunctionCall[] = SolidityAntlr.parseFunctionCalls(c.subNodes);

        for (const f_c of f_cs) {
            if (StringUtility.matchRegex(f_c.name, new RegExp("^block.blockhash$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], f_c.location));
            } else if (StringUtility.matchRegex(f_c.name, new RegExp("^blockhash$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], f_c.location));
            }
        }
    }

    return issuePointers;
};

exports.WeakRandomnessFunction = WeakRandomnessFunction;
