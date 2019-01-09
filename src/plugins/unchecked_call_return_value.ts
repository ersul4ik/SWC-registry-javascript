const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Location from "../misc/location";
import FunctionCall from "../core/expressions/function_call";
import NodeTypes from "../maru/node_types";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let UncheckedCallReturnValue: Plugin;

/*
 * Find the outer left function of an ExpressionStatement. If that is a call or delegate call then raise an issue
 */

UncheckedCallReturnValue = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const source of sol_file.sources) {
        const f_cs: FunctionCall[] = source.parseFunctionCalls(source.source_unit[0].id);

        for (const f_c of f_cs) {
            if (
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^call$")) ||
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^delegatecall$")) ||
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^send$")) ||
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^callcode$"))
            ) {
                const parents: any[] = source.getParents(f_c.location.id);

                if (NodeUtility.matchRegex(parents[0].name, new RegExp(NodeTypes.ExpressionStatement))) {
                    let function_name: string = "";
                    if (f_c.identifier_name) {
                        function_name = `${f_c.identifier_name}.${f_c.member_name1}`;
                    } else {
                        function_name = `${f_c.identifier_name}`;
                    }

                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        `${function_name}`
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f_c.location));
                }
            }
        }
    }

    return issuePointers;
};

exports.UncheckedCallReturnValue = UncheckedCallReturnValue;
