const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Location from "../misc/location";

let UncheckedCallReturnValue: Plugin;

/*
 * Find the outer left function of an ExpressionStatement. If that is a call or delegate call then raise an issue
 */

UncheckedCallReturnValue = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    let functions: any = [];
    let expression_nr: number = 0;

    parser.visit(sol_file.block.branch, {
        ExpressionStatement(expr: any) {
            expression_nr += 1;
            parser.visit(expr, {
                FunctionCall(f_call: any) {
                    parser.visit(f_call, {
                        MemberAccess(mb: any) {
                            if (
                                NodeUtility.matchRegex(mb.memberName, new RegExp("^call$")) ||
                                NodeUtility.matchRegex(mb.memberName, new RegExp("^delegatecall$")) ||
                                NodeUtility.matchRegex(mb.memberName, new RegExp("^send$")) ||
                                NodeUtility.matchRegex(mb.memberName, new RegExp("^callcode$"))
                            ) {
                                let entry: any = {};
                                entry.expr_nr = expression_nr;
                                entry.expr_range = expr.range;
                                entry.type = mb.memberName;
                                entry.type_range = mb.range;
                                entry.node = f_call;
                                functions.push(entry);
                                //    Logger.info(entry);
                            }
                        }
                    });

                    parser.visit(f_call, {
                        Identifier(identifier: any) {
                            if (
                                NodeUtility.matchRegex(identifier.name, new RegExp("^require$")) ||
                                NodeUtility.matchRegex(identifier.name, new RegExp("^assert$"))
                            ) {
                                let entry: any = {};
                                entry["expr_nr"] = expression_nr;
                                entry["expr_range"] = expr.range;
                                entry["type"] = identifier.name;
                                entry["type_range"] = identifier.range;
                                entry["node"] = f_call;
                                functions.push(entry);
                            }
                        }
                    });
                }
            });
        }
    });

    for (let i = 1; i <= expression_nr; i++) {
        let outer_caller: any = {};
        let functions_of_expr = getFunctionsForExprStatement(i, functions);

        if (functions_of_expr.length >= 1) {
            outer_caller = functions_of_expr[0];
        }

        if (functions_of_expr.length > 1) {
            for (let x = 0; x < functions_of_expr.length; x++) {
                // AstUtility.printNode(functions_of_expr[x])
                if (functions_of_expr[x]["type_range"][0] < outer_caller["type_range"][0]) {
                    outer_caller = functions_of_expr[x];
                }
            }
        }

        if (
            NodeUtility.matchRegex(outer_caller["type"], new RegExp("^call$")) ||
            NodeUtility.matchRegex(outer_caller["type"], new RegExp("^delegatecall$")) ||
            NodeUtility.matchRegex(outer_caller["type"], new RegExp("^send$")) ||
            NodeUtility.matchRegex(outer_caller["type"], new RegExp("^callcode$"))
        ) {
            const location: Location = SolidityAntlr.parseLocation(outer_caller["node"].loc, outer_caller["node"].range);
            issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], location));
        }
    }
    return issuePointers;
};

function getFunctionsForExprStatement(expr_id: number, functions: Array<any>) {
    let functions_of_expr = [];
    for (let i = 0; i < functions.length; i++) {
        if (functions[i]["expr_nr"] === expr_id) {
            functions_of_expr.push(functions[i]);
        }
    }
    return functions_of_expr;
}

exports.UncheckedCallReturnValue = UncheckedCallReturnValue;
