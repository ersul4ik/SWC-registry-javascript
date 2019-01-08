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
import DescriptionUtils from "../utils/description";
import MemberAccess from "../core/expressions/member_access";
import NodeTypes from "../maru/node_types";
import Identifier from "../core/expressions/identifier";
import Description from "../maru/description";

let AuthorizationTXOrigin: Plugin;
AuthorizationTXOrigin = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const source of sol_file.sources) {
        const members: MemberAccess[] = source.parseMemberAccess(source.source_unit[0].id);

        for (const member of members) {
            const identifier: Identifier = source.parseIdentifiers(member.location.id)[0];

            if (
                NodeUtility.matchRegex(member.member_name, new RegExp("^origin$")) &&
                NodeUtility.matchRegex(identifier.name, new RegExp("^tx$"))
            ) {
                let description: Description = plugin_config.description[0];
                let parents: any[] = source.getParents(member.location.id);

                for (const parent of parents) {
                    if (NodeUtility.matchString(parent.name, NodeTypes.BinaryOperation)) {
                        description = plugin_config.description[1];
                    }
                }

                issuePointers.push(new IssuePointer(plugin_config.swcID, description, member.location));
            }
        }
    }

    return issuePointers;
};

exports.AuthorizationTXOrigin = AuthorizationTXOrigin;
