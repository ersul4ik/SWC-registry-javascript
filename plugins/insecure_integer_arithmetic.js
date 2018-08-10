
const parser = require('solidity-parser-antlr');
const util = require('util')
const { IssueDetailed, IssuePointer } = require('../src/issue.js')
const AstUtility  = require('../src/ast_utility.js')

exports.InsecureIntegerArithmetic = function (ast){
	var issue_pointers = []
	
	parser.visit(ast, {
	  ExpressionStatement: function(node) {

	    const expr = node.expression
	    if (expr.type === 'BinaryOperation'){
  			var code = ""
	    	code += expr['left']['name']
	    	code += expr['operator']

	    	if(expr['right']['left'] != undefined ){
	    		code += expr['right']['left']['name']
	    		code += expr['right']['operator']
	    		code += expr['right']['right']['number']
	    	} else {
	    		//console.log(expr['right']['name'])	
	    		code += expr['right']['name']
	    	}
	    	var linenumber = expr['loc']['start']['line']
			var issue_pointer = new IssuePointer( code, linenumber)

			issue_pointers.push(issue_pointer);
			
	    }
	  }
	})
	return issue_pointers;    	
}