const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Variable from "../core/declarations/variable";
import SolidityAntlr from "../parser/solidity_antlr";
import Node from "../misc/node";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let DefaultVisibilityStateVariable: Plugin;

/*
 * The module relies on the deprecated Antlr AST as the solc AST makes no distinction between default and explicitly defined visibility
 */

DefaultVisibilityStateVariable = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    const vars: Variable[] = SolidityAntlr.parseVariables(new Node(sol_file.antlrAST));

    for (const v of vars) {
        if (NodeUtility.matchString(v.visibility, "default") && v.isConstant === false) {
            const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [v.name]);
            issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, v.location));
        }
    }

    return issuePointers;
};

exports.DefaultVisibilityStateVariable = DefaultVisibilityStateVariable;
