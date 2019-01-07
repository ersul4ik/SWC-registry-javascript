const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let ShadowingVariablesFunction: Plugin;

ShadowingVariablesFunction = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    for (const c of sol_file.contracts) {
        c.linearizedBaseContracts;
    }
    return issuePointers;
};

exports.ShadowingVariablesFunction = ShadowingVariablesFunction;
