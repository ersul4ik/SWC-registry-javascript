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
import Variable from "../core/declarations/variable";
import Identifier from "../core/expressions/identifier";

let UnusedVariable: Plugin;

UnusedVariable = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    let vars: Variable[] = [];
    let identifiers: Identifier[] = [];

    // TODO: Check if state variables are referenced in imported contracts

    for (const source of sol_file.sources) {
        vars = vars.concat(source.parseVariables(source.source_unit[0].id));
        identifiers = identifiers.concat(source.parseIdentifiers(source.source_unit[0].id));

        for (const v of vars) {
            let found: boolean = false;
            for (const i of identifiers) {
                if (i.referencedDeclaration === v.location.id) {
                    found = true;
                }
            }
            if (!found) {
                if (v.isStateVar) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [v.name]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, v.location));
                } else {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[1], [v.name]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, v.location));
                }
            }
        }
    }

    return issuePointers;
};

exports.UnusedVariable = UnusedVariable;
