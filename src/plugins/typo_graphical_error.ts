const parser = require("solidity-parser-antlr");

import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import BinaryOperation from "../core/expressions/binary_operation";
import SolidityAntlr from "../parser/solidity_antlr";
import Assignment from "../core/expressions/assignment";
import UnaryOperation from "../core/expressions/unary_operation";
import Description from "../maru/description";
import DescriptionUtils from "../utils/description";
import NodeUtility from "../utils/node";

let TypoGraphicalError: Plugin;

TypoGraphicalError = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    /*
    for (const source of sol_file.sources) {
        const ass: Assignment[] = source.parseAssignment(source.source_unit[0].id);

        for (const a of ass) {
            const unops: UnaryOperation[] = source.parseUnaryOperation(a.location.id);
            if (unops.length > 0) {
                const bops: BinaryOperation[] = source.parseBinaryOperation(a.location.id);
                let found_op: BinaryOperation;

                for (const unop of unops) {
                    if (bops.length > 0) {
                        for (const bop of bops) {
                            let found_bop_with_no_unop: boolean = true;
                            const bop_children: UnaryOperation[] = source.parseUnaryOperation(bop.location.id);
                            for (const bop_child of bop_children) {
                                if (bop_child.location.id === unop.location.id) {
                                }
                            }
                        }
                    } else {
                        found_op = unop;
                        break;
                    }
                }

                const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                    a.operator + unops[0].operator
                ]);
                issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, found_op.location));
            }
        }
    }*/

    return issuePointers;
};

exports.TypoGraphicalError = TypoGraphicalError;
