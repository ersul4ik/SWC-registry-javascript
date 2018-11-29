const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";

let IncorrectInheritanceOrderFunction: Plugin;

IncorrectInheritanceOrderFunction = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    // include imported contracts
    for (const c of sol_file.contracts_current) {
        for (const f of c.functions) {
            console.log(f.name);
        }
    }
    return issuePointers;
};

exports.IncorrectInheritanceOrderFunction = IncorrectInheritanceOrderFunction;