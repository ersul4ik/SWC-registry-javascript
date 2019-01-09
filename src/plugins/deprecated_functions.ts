const parser = require("solidity-parser-antlr");
const util = require("util");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Identifier from "../core/expressions/identifier";
import logger from "../logger/logger";
import FunctionCall from "../core/expressions/function_call";
import MemberAccess from "../core/expressions/member_access";
import DescriptionUtils from "../utils/description";
import Description from "../maru/description";
import Throw from "../core/expressions/throw";
import NodeTypes from "../maru/node_types";
import Node from "../misc/node";

let DeprecatedFunctions: Plugin;

DeprecatedFunctions = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const f of sol_file.getFunctions()) {
        if (NodeUtility.matchString(f.stateMutability, "constant")) {
            const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [f.name]);
            issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f.location));
        }
    }

    for (const source of sol_file.sources) {
        const f_cs: FunctionCall[] = source.parseFunctionCalls(source.source_unit[0].id);

        for (const f_c of f_cs) {
            if (NodeUtility.matchRegex(f_c.identifier_name, new RegExp("^sha3$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[1], f_c.location));
            }

            if (NodeUtility.matchRegex(f_c.identifier_name, new RegExp("^suicide$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[2], f_c.location));
            } else if (NodeUtility.matchRegex(f_c.member_name1, new RegExp("callcode$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[3], f_c.location));
            } else if (
                NodeUtility.matchRegex(f_c.member_name1, new RegExp("^blockhash$")) &&
                NodeUtility.matchRegex(f_c.identifier_name, new RegExp("^block$"))
            ) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[4], f_c.location));
            }
        }

        const identifiers: Identifier[] = source.parseIdentifiers(source.source_unit[0].id);

        for (const identifier of identifiers) {
            if (NodeUtility.matchRegex(identifier.name, new RegExp("^msg$"))) {
                const parents: any[] = source.getParents(identifier.location.id);
                if (parents.length > 0) {
                    if (NodeUtility.matchRegex(parents[0].name, new RegExp(`^${NodeTypes.MemberAccess}$`))) {
                        if (NodeUtility.matchRegex(parents[0].attributes.member_name, new RegExp("^gas$"))) {
                            issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[5], identifier.location));
                        }
                    }
                }
            }
        }
    }

    for (const source of sol_file.sources) {
        const ths: Throw[] = source.parseThrow(source.source_unit[0].id);

        for (const th of ths) {
            issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.description[6], th.location));
        }
    }

    return issuePointers;
};

exports.DeprecatedFunctions = DeprecatedFunctions;
