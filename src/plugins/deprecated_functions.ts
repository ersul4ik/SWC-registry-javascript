const parser = require("solidity-parser-antlr");
const util = require("util");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";
import SolFile from "../maru/sol_file";
import PluginConfig from "../maru/plugin_config";
import SolidityAntlr from "../parser/solidity_antlr";
import Identifier from "../expressions/identifier";
import logger from "../logger/logger";
import FunctionCall from "../expressions/function_call";

let DeprecatedFunctions: Plugin;

DeprecatedFunctions = function (sol_file: SolFile, plugin_config: PluginConfig): IssuePointer[] {
  const issuePointers: IssuePointer[] = [];

  for (const f of sol_file.getContractFunctions()) {
    if (AstUtility.matchRegex(f.stateMutability, new RegExp("constant"))) {
      issuePointers.push(new IssuePointer(plugin_config.swcID, f.location));
    }
  }

  for (const c of sol_file.contracts_current) {
    const f_cs: FunctionCall[] = SolidityAntlr.parseFunctionCalls(c.subNodes.branch);
    for (const f_c of f_cs) {
      if (AstUtility.matchRegex(f_c.name, new RegExp("sha3")) || AstUtility.matchRegex(f_c.name, new RegExp("suicide"))) {
        issuePointers.push(new IssuePointer(plugin_config.swcID, f_c.location));
      }
    }
  }

  /*

    /*
    parser.visit(ast, {
      FunctionCall(f_call: any) {
        parser.visit(f_call, {
          Identifier(identifier: any) {
            if (AstUtility.matchRegex(identifier.name, new RegExp("sha3")) || AstUtility.matchRegex(identifier.name, new RegExp("suicide"))) {
              issuePointers.push(AstUtility.createIssuePointerFromNode(id, identifier));
            }
          }
        });
        parser.visit(f_call, {
          MemberAccess(member: any) {
            if (AstUtility.matchRegex(member.memberName, new RegExp("callcode"))) {
              issuePointers.push(AstUtility.createIssuePointerFromNode(id, member));
            }
          }
        });
      },
  
      MemberAccess(member: any) {
        parser.visit(member, {
          Identifier(identifier: any) {
            if (AstUtility.matchRegex(identifier.name, new RegExp("msg")) && AstUtility.matchRegex(member.memberName, new RegExp("gas"))) {
              issuePointers.push(AstUtility.createIssuePointerFromNode(id, member));
            }
            if (AstUtility.matchRegex(identifier.name, new RegExp("block")) && AstUtility.matchRegex(member.memberName, new RegExp("blockhash"))) {
              issuePointers.push(AstUtility.createIssuePointerFromNode(id, member));
            }
          }
        });
      },
  
      ThrowStatement(throw_statement: any) {
        issuePointers.push(AstUtility.createIssuePointerFromNode(id, throw_statement));
      },
  
      FunctionDefinition(func: any) {
        if (AstUtility.matchRegex(func.stateMutability, new RegExp("constant"))) {
          issuePointers.push(AstUtility.createIssuePointerFromNode(id, func));
        }
      }
  
    });
  
    */
  return issuePointers;
};

exports.DeprecatedFunctions = DeprecatedFunctions;