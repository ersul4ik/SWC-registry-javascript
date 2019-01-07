const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import UserDefinedType from "../core/types/user_defined_type";
import Variable from "../core/declarations/variable";

let UndeclaredStoragePointer: Plugin;

UndeclaredStoragePointer = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];

    /*
    for (const source of sol_file.sources) {
        const vars: Variable[] = source.parseVariables(source.source_unit[0].id);
        for (const v of vars) {
            if (
                NodeUtility.matchString(v.storageLocation, "default") &&
                v.isStateVar === false &&
                v.type instanceof UserDefinedType &&
                v.initialValue === null
            ) {
                issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], v.location));
            }
        }
    }

    */

    return issuePointers;
};

exports.UndeclaredStoragePointer = UndeclaredStoragePointer;
