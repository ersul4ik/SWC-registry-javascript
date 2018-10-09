const parser = require("solidity-parser-antlr");
import AstUtility from "../src/ast_utility";
import { IssuePointer } from "../src/issue";
import { Plugin } from '../src/plugin';

let UncheckedCallReturnValue: Plugin;
const id = "SWC-104";

/*
 * Find the outer left function of an ExpressionStatement. If that is a call or delegate call then raise an issue
 * Todo: include callcode and send 
 */

UncheckedCallReturnValue = function (ast: any){
  const issuePointers: IssuePointer[] = [];
  let functions:any = [];
  let expression_nr:number = 0;

  parser.visit(ast, {
 
    ExpressionStatement(expr: any) {
      expression_nr += 1;
      parser.visit(expr, {
        FunctionCall(f_call: any) {
          parser.visit(f_call, {
            MemberAccess(mb: any) {
              if(AstUtility.matchRegex(mb.memberName, new RegExp("^call$")) || AstUtility.matchRegex(mb.memberName, new RegExp("^delegatecall$"))){
               let entry:any =  {};
               entry['expr_nr'] = expression_nr;
               entry['expr_range'] = expr.range;
               entry['type'] = mb.memberName;
               entry['type_range'] = mb.range;
               entry['node'] = f_call;
              functions.push(entry);
              }  
            }
          });

          parser.visit(f_call, {
            Identifier(identifier: any) {
              if(AstUtility.matchRegex(identifier.name, new RegExp("^require$")) || AstUtility.matchRegex(identifier.name, new RegExp("^assert$"))){
                let entry:any =  {};
                entry['expr_nr'] = expression_nr;
                entry['expr_range'] = expr.range;
                entry['type'] = identifier.name;
                entry['type_range'] = identifier.range;
                entry['node'] = f_call;
               functions.push(entry);
              }
            }
          });    
        }
      }); 

    },
  }); 

  for (let i = 1; i <= expression_nr; i++) { 
    let outer_caller:any = {};
    let functions_of_expr = getFunctionsForExprStatement(i,functions);


    if(functions_of_expr.length >= 1){
      outer_caller = functions_of_expr[0];
    }  

    if (functions_of_expr.length > 1 ){
      for (let x = 0; x < functions_of_expr.length; x++) { 
       // AstUtility.printNode(functions_of_expr[x])
        if(functions_of_expr[x]['type_range'][0] < outer_caller['type_range'][0]){
          outer_caller = functions_of_expr[x];

        }
      }
    }

    if(AstUtility.matchRegex(outer_caller['type'],new RegExp("^call$")) || AstUtility.matchRegex(outer_caller['type'],new RegExp("^delegatecall$")) ){

      issuePointers.push(AstUtility.createIssuePointerFromNode(id,outer_caller['node']));
    }  
  }
  return issuePointers;
};


function getFunctionsForExprStatement(expr_id:number, functions:Array<any>){
  let functions_of_expr =[];
  for (let i = 0; i < functions.length; i++) { 
    if(functions[i]['expr_nr'] === expr_id){
      functions_of_expr.push(functions[i]);
    }
  }  
  return functions_of_expr;
}

exports.UncheckedCallReturnValue = UncheckedCallReturnValue;