const parser = require("solidity-parser-antlr");

import NodeUtility from "../utils/node";
import { IssuePointer } from "../maru/issue";
import { Plugin } from "../maru/plugin";
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Location from "../misc/location";

let AuthorizationTXOrigin: Plugin;
AuthorizationTXOrigin = function(sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
    const issuePointers: IssuePointer[] = [];
    /*
    parser.visit(sol_file.block, {
        BinaryOperation(b_op: any) {
            if (NodeUtility.matchRegex(b_op.operator, new RegExp("==")) || NodeUtility.matchRegex(b_op.operator, new RegExp("!="))) {
                parser.visit(b_op, {
                    MemberAccess(member: any) {
                        parser.visit(b_op, {
                            Identifier(identifier: any) {
                                if (
                                    NodeUtility.matchRegex(member.memberName, new RegExp("^origin$")) &&
                                    NodeUtility.matchRegex(identifier.name, new RegExp("^tx$"))
                                ) {
                                    const location: Location = SolidityAntlr.parseLocation(member.loc, member.range);
                                    issuePointers.push(new IssuePointer(plugin_config.swcID, plugin_config.descriptionShort[0], location));
                                }
                            }
                        });
                    }
                });
            }
        }
    });
    */
    return issuePointers;
};

exports.AuthorizationTXOrigin = AuthorizationTXOrigin;
