const parser = require("solidity-parser-antlr");

import AstUtility from "../utils/ast";
import { IssuePointer } from "../maru/issue";
import { Plugin } from '../maru/plugin';
import Logger from "../logger/logger";

let AuthorizationTXOrigin: Plugin;
const id = "SWC-115";

AuthorizationTXOrigin = (ast: any) => {
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    BinaryOperation(b_op: any) {
      if (AstUtility.matchRegex(b_op.operator, new RegExp("==")) ||
        AstUtility.matchRegex(b_op.operator, new RegExp("!="))) {
        parser.visit(b_op, {
          MemberAccess(member: any) {
            parser.visit(b_op, {
              Identifier(identifier: any) {
                if (AstUtility.matchRegex(member.memberName, new RegExp("^origin$")) &&
                  AstUtility.matchRegex(identifier.name, new RegExp("^tx$"))) {
                  //   issuePointers.push(AstUtility.createIssuePointerFromNode(id,member));
                }
              },
            });
          }
        });
      }
    },
  });
  return issuePointers;
};

exports.AuthorizationTXOrigin = AuthorizationTXOrigin;