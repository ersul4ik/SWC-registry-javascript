const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import FunctionCall from "../core/expressions/function_call";
import SolidityAntlr from "../parser/solidity_antlr";
import NodeUtility from "../utils/node";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let WeakRandomnessFunction: Plugin;

WeakRandomnessFunction = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const source of sol_file.sources) {
        const f_cs: FunctionCall[] = source.parseFunctionCalls(source.source_unit[0].id);

        for (const f_c of f_cs) {
            if (
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^blockhash$")) &&
                NodeUtility.matchRegex(f_c.identifier_name, new RegExp("^block$"))
            ) {
                const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                    "block.blockhash"
                ]);
                issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f_c.location));
            } else if (NodeUtility.matchRegex(f_c.identifier_name, new RegExp("^blockhash$"))) {
                const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], ["blockhash"]);

                issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f_c.location));
            }
        }
    }

    return issuePointers;
};

exports.WeakRandomnessFunction = WeakRandomnessFunction;
