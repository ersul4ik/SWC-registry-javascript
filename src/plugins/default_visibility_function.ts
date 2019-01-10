const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import CFunction from "../core/declarations/function";
import NodeUtility from "../utils/node";
import Node from "../misc/node";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let DefaultVisibilityFunction: Plugin;

/*
 * The module relies on the deprecated Antlr AST as the solc AST makes no distinction between default and explicitly defined visibility
 */

DefaultVisibilityFunction = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    const functions: CFunction[] = SolidityAntlr.parseFunction(new Node(sol_file.antlrAST));

    for (const f of functions) {
        if (NodeUtility.matchString(f.visibility, "default")) {
            const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [f.name]);
            f.location.src = SolidityAntlr.fixSource(sol_file, f.location.src);
            issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, f.location));
        }
    }

    return issuePointers;
};

exports.DefaultVisibilityFunction = DefaultVisibilityFunction;
