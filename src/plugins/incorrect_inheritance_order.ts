const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let IncorrectInheritanceOrder: Plugin;

IncorrectInheritanceOrder = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    return issuePointers;
};

exports.IncorrectInheritanceOrder = IncorrectInheritanceOrder;
