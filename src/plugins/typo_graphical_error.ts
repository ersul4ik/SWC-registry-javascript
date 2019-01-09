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

    for (const source of sol_file.sources) {
        const ass: Assignment[] = source.parseAssignment(source.source_unit[0].id);

        for (const a of ass) {
            //const l_node: any = source.getRelativeNode(a.location.id, 1);
            const r_node: any = source.getRelativeNode(a.location.id, 2);

            let unop: UnaryOperation[] = source.parseUnaryOperation(undefined, [r_node.id]);

            if (unop.length > 0) {
                const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                    a.operator + unop[0].operator
                ]);
                issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, unop[0].location));
            }

            let bop: BinaryOperation[] = source.parseBinaryOperation(undefined, [r_node.id]);

            if (bop.length > 0) {
                const l_node: any = source.getRelativeNode(bop[0].location.id, 1);
                unop = source.parseUnaryOperation(undefined, [l_node.id]);

                if (unop.length > 0) {
                    const formatted_description: Description = DescriptionUtils.formatParameters(plugin_config.description[0], [
                        a.operator + unop[0].operator
                    ]);
                    issuePointers.push(new IssuePointer(plugin_config.swcID, formatted_description, unop[0].location));
                }
            }
        }

        /*
  
                */
    }

    return issuePointers;
};

exports.TypoGraphicalError = TypoGraphicalError;
