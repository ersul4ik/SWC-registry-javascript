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
import Contract from "../core/declarations/contract";
import Source from "../maru/source";
import Node from "../misc/node";
import CFunction from "../core/declarations/function";

let UnusedVariable: Plugin;

UnusedVariable = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    let identifiers: Identifier[] = [];

    for (const source of sol_file.sources) {
        let vars: Variable[] = [];
        vars = vars.concat(source.parseVariables());
        identifiers = identifiers.concat(source.parseIdentifiers(source.source_unit[0].id));

        for (const v of vars) {
            let found: boolean = false;
            for (const i of identifiers) {
                if (i.referencedDeclaration === v.location.id) {
                    found = true;
                }
            }
            if (!found) {
                let source_of_var: Source = sol_file.getSourceOfNode(v.scope)[0];

                for (const n of source_of_var.getParents(v.location.id)) {
                    const c: Contract[] = source_of_var.parseContracts(undefined, [n.id]);
                    const f: CFunction[] = source_of_var.parseFunction(undefined, [n.id]);
                    if (c.length > 0 || f.length > 0) {
                        if (v.isStateVar) {
                            const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                                v.name,
                                c[0].name
                            ]);
                            issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, v.location));
                        } else {
                            const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[1], [
                                v.name,
                                f[0].name
                            ]);
                            issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, v.location));
                        }
                    }
                    break;
                }
            }
        }
    }

    return issuePointers;
};

exports.UnusedVariable = UnusedVariable;
