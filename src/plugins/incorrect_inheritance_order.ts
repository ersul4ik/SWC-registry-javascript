const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let IncorrectInheritanceOrder: Plugin;

/*
 * Get all internal function calls, identify the function that gets called and which contract and compare if the function call
 * occurs in a different contract then where the function call happens
 */

IncorrectInheritanceOrder = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    return issuePointers;
};

exports.IncorrectInheritanceOrder = IncorrectInheritanceOrder;
