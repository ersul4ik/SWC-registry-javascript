const parser = require("solidity-parser-antlr");
const util = require("util");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Identifier from "../expressions/identifier";
import logger from "../logger/logger";
import FunctionCall from "../expressions/function_call";
import MemberAccess from "../expressions/member_access";

let DeprecatedFunctions: Plugin;

DeprecatedFunctions = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const f of sol_file.getContractFunctions()) {
        if (NodeUtility.matchRegex(f.stateMutability, new RegExp("constant"))) {
            issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], f.location));
        }
    }

    for (const c of sol_file.contracts_current) {
        const f_cs: FunctionCall[] = SolidityAntlr.parseFunctionCalls(c.subNodes);
        for (const f_c of f_cs) {
            if (NodeUtility.matchRegex(f_c.name, new RegExp("^sha3$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[1], f_c.location));
            }

            if (NodeUtility.matchRegex(f_c.name, new RegExp("^suicide$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[2], f_c.location));
            } else if (NodeUtility.matchRegex(f_c.name, new RegExp(".callcode$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[3], f_c.location));
            } else if (NodeUtility.matchRegex(f_c.name, new RegExp("^block.blockhash$"))) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[5], f_c.location));
            }
        }

        const members: MemberAccess[] = SolidityAntlr.parseMemberAccess(c.subNodes);

        for (const m of members) {
            if (NodeUtility.matchRegex(m.name, new RegExp("^gas$"))) {
                if (NodeUtility.hasProperty(m.expression.branch, "type") && NodeUtility.hasProperty(m.expression.branch, "name")) {
                    if (NodeUtility.matchRegex(m.expression.branch.name, new RegExp("^msg$"))) {
                        issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[6], m.location));
                    }
                }
            }
        }
    }

    for (const t of SolidityAntlr.parseThrowStatements(sol_file.block)) {
        issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[7], t.location));
    }

    return issuePointers;
};

exports.DeprecatedFunctions = DeprecatedFunctions;
