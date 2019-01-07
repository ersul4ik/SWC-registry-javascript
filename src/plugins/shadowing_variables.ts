const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import Variable from "../core/declarations/variable";
import Contract from "../core/declarations/contract";
import ContractUtils from "../utils/contract";
import Node from "../misc/node";
import NodeUtility from "../utils/node";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";

let ShadowingStateVariables: Plugin;

ShadowingStateVariables = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    let vars: { var: Variable; contract_name: string }[] = [];

    for (const c of sol_file.contracts) {
        for (const v of c.variables) {
            if (v.isStateVar === true) {
                vars.push({ var: v, contract_name: c.name });
            }
        }
        if (c.inheritedContracts.length > 0) {
            for (const inherited_contract_type of c.inheritedContracts) {
                const inherited_contract: Contract[] = ContractUtils.getBaseContract(inherited_contract_type.name, sol_file.getContracts());
                if (inherited_contract.length === 0) {
                    for (const v of inherited_contract[0].variables) {
                        if (v.isStateVar === true) {
                            vars.push({ var: v, contract_name: inherited_contract[0].name });
                        }
                    }
                }
            }
        }
    }

    for (let x = 0; x < vars.length; x++) {
        for (let y = 0; y < vars.length; y++) {
            if (x < y) {
                if (vars[x]["var"].name === vars[y]["var"].name) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        vars[x]["var"].name,
                        vars[x]["contract_name"],
                        vars[x]["var"].name,
                        vars[y]["contract_name"]
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, vars[x]["var"].location));
                }
            }
        }
    }

    return issuePointers;
};

exports.ShadowingStateVariables = ShadowingStateVariables;
