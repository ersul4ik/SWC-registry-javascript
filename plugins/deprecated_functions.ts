const parser = require("solidity-parser-antlr");
const util = require("util");

import AstUtility from "../src/ast_utility";
import { IssueDetailed, IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let DeprecatedFunctions: Plugin;
const id = "SWC-111";

DeprecatedFunctions = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  
  parser.visit(ast, {
    FunctionCall(f_call: any) {
      parser.visit(f_call, {
        Identifier(identifier: any) {
          if(AstUtility.matchRegex(identifier.name, new RegExp("sha3")) || AstUtility.matchRegex(identifier.name, new RegExp("suicide"))){
            issuePointers.push(AstUtility.createIssuePointerFromNode(id,identifier));
          }  
        }
      });
      parser.visit(f_call, {
        MemberAccess(member: any) {
          if(AstUtility.matchRegex(member.memberName, new RegExp("callcode"))){
            issuePointers.push(AstUtility.createIssuePointerFromNode(id,member));
          }
        }
      });
    },

    MemberAccess(member: any) {
      parser.visit(member, {
        Identifier(identifier: any) {
          if(AstUtility.matchRegex(identifier.name, new RegExp("msg")) && AstUtility.matchRegex(member.memberName, new RegExp("gas"))){
            issuePointers.push(AstUtility.createIssuePointerFromNode(id,member));
          }
          if(AstUtility.matchRegex(identifier.name, new RegExp("block")) && AstUtility.matchRegex(member.memberName, new RegExp("blockhash"))){
            issuePointers.push(AstUtility.createIssuePointerFromNode(id,member));
          }
        }  
      });
    },

    ThrowStatement(throw_statement: any) {
      issuePointers.push(AstUtility.createIssuePointerFromNode(id,throw_statement));
    },

    FunctionDefinition(func: any) {
      if(AstUtility.matchRegex(func.stateMutability, new RegExp("constant"))){
        issuePointers.push(AstUtility.createIssuePointerFromNode(id,func));
      }
    }

  });
  return issuePointers;
};


exports.DeprecatedFunctions = DeprecatedFunctions;