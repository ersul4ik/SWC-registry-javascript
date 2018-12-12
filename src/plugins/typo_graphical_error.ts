const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import BinaryOperation from "../expressions/binary_operation";
import SolidityAntlr from "../parser/solidity_antlr";
import AstUtility from "../utils/ast";

let TypoGraphicalErrorFunction: Plugin;

TypoGraphicalErrorFunction = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    const bops: BinaryOperation[] = SolidityAntlr.parseBinaryOperation(sol_file.block);

    for (const bop of bops) {
        if (AstUtility.matchRegex(bop.operator, new RegExp("^=$"))) {
            AstUtility.printNode(bop)
            if (AstUtility.hasProperty(bop.right.branch, "type") &&
                AstUtility.hasProperty(bop.right.branch, "operator")) {

                if (AstUtility.matchRegex(bop.right.branch["type"], new RegExp("^BinaryOperation|UnaryOperation$")) &&
                    AstUtility.matchRegex(bop.right.branch["operator"], new RegExp("^\\+|-$"))) {
                    issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], bop.location));
                }

            }
        }

    }
    return issuePointers;
};

exports.TypoGraphicalErrorFunction = TypoGraphicalErrorFunction;