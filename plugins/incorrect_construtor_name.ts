const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let IncorrectConstructorName: Plugin;
const id = "SWC-118";

IncorrectConstructorName = function (ast: any){
  const issuePointers: IssuePointer[] = [];

  parser.visit(ast, {
    ContractDefinition(node: any) {
      let contract_name:string = node.name;
      let has_constructor:boolean = false;

      parser.visit(node, {
        FunctionDefinition(func: any) {
          if(func.isConstructor){
            has_constructor = true;
          }
        },
      });
      if(!has_constructor){
        parser.visit(node, {
          FunctionDefinition(func: any) {
            if(AstUtility.matchRegex(func.name, new RegExp("^" +contract_name + "$",'i'))){
              issuePointers.push(AstUtility.createIssuePointerFromNode(id,func));
            }
 
            else if(AstUtility.matchRegex(func.name, new RegExp("^constructor$",'i'))){
              issuePointers.push(AstUtility.createIssuePointerFromNode(id,func));
            }
            console.log(func.name);
          },
        });
      }
    },
  });
  return issuePointers;
};

exports.IncorrectConstructorName = IncorrectConstructorName;